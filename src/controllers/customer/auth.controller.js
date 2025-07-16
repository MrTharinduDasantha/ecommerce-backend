const User = require("../../models/user.model");
const Customer = require("../../models/customer.model");
const pool = require("../../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { getOrgMail } = require('../../utils/organization');

// Create transporter for emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #1D372E; margin-bottom: 5px;">Password Reset</h2>
          <p style="color: #666;">Use the verification code below to reset your password</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #5CAF90; margin: 0;">${otp}</h1>
        </div>
        
        <p style="color: #666; margin-bottom: 20px; text-align: center;">This code will expire in 10 minutes.</p>
        
        <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
          <p>© ${new Date().getFullYear()} Ecommerce. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// Customer Authentication Controller
class CustomerAuthController {
  // Register a new customer
 // Register a new customer
async register(req, res) {
  try {
    const { first_name, full_name, email, password, mobile_no } = req.body;

    // Check if email is already used
    const existingCustomer = await Customer.getCustomerByEmail(email);
    if (existingCustomer) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Set status explicitly to "Active"
    const status = "Active";

    // These parameters need to match the addCustomer function in the model
    // Adjusting for default nulls for address, city, country
    const customerId = await Customer.addCustomer(
      first_name,
      full_name,
      null, // address
      null, // city
      null, // country
      mobile_no,
      status, // Use the explicitly set status
      email,
      hashedPassword // Use the hashed password
    );

    res
      .status(201)
      .json({ id: customerId, message: "Customer registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
}

  // Login as a customer
 async login(req, res) {
  try {
    const { email, password } = req.body;

    console.log("Login attempt for:", email);

    // Check if the email exists
    const orgMail = getOrgMail();
    const [rows] = await pool.query(
      "SELECT * FROM Customer WHERE Email = ? AND orgmail = ?",
      [email, orgMail]
    );

    if (rows.length === 0) {
      console.log("No customer found with email:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const customer = rows[0];

    // Check if account is active
    if (customer.Status !== 'Active') {
      return res.status(403).json({ message: "Your account is inactive. Please contact admin." });
    }

    console.log("Customer found:", {
      id: customer.idCustomer,
      email: customer.Email,
    });
    console.log("Stored password hash:", customer.Password);

    // Verify the password using bcrypt
    console.log("Attempting to compare password with hash");
    const isPasswordValid = await bcrypt.compare(password, customer.Password);
    console.log("Password validation result:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Password validation failed");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Password validated successfully, generating token");

    // Generate a JWT token
    const token = jwt.sign(
      {
        customerId: customer.idCustomer,
        email: customer.Email,
        role: "customer",
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return the token and user data
    res.json({
      token,
      user: {
        id: customer.idCustomer,
        email: customer.Email,
        name: customer.Full_Name,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
}
  // Request password reset
  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Check if customer exists
      const customer = await Customer.getCustomerByEmail(email);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      // Generate OTP
      const otp = generateOTP();

      // Set OTP expiration time (10 minutes from now)
      const otpExpires = new Date();
      otpExpires.setMinutes(otpExpires.getMinutes() + 10);

      // Store OTP in database
      const orgMail = getOrgMail();
      await pool.query(
        "UPDATE Customer SET reset_password_otp = ?, reset_password_otp_expires = ? WHERE idCustomer = ? AND orgmail = ?",
        [otp, otpExpires, customer.idCustomer, orgMail]
      );

      // Send OTP via email
      await sendOTPEmail(email, otp);

      res.json({
        message: "Password reset OTP sent to your email",
        customer_id: customer.idCustomer,
      });
    } catch (error) {
      console.error("Error in requestPasswordReset:", error);
      res.status(500).json({
        message: "Failed to request password reset",
        error: error.message,
      });
    }
  }

  // Verify OTP
  async verifyOTP(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
      }

      // Check if customer exists
      const customer = await Customer.getCustomerByEmail(email);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      // Check if OTP matches and is not expired
      const now = new Date();
      if (customer.reset_password_otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      if (customer.reset_password_otp_expires < now) {
        return res.status(400).json({ message: "OTP has expired" });
      }

      res.json({
        message: "OTP verified successfully",
        customer_id: customer.idCustomer,
      });
    } catch (error) {
      console.error("Error in verifyOTP:", error);
      res
        .status(500)
        .json({ message: "Failed to verify OTP", error: error.message });
    }
  }

  // Reset password
  async resetPassword(req, res) {
    try {
      const { email, otp, new_password } = req.body;

      if (!email || !otp || !new_password) {
        return res
          .status(400)
          .json({ message: "Email, OTP, and new password are required" });
      }

      // Check if customer exists
      const customer = await Customer.getCustomerByEmail(email);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      // Check if OTP matches and is not expired
      const now = new Date();
      if (customer.reset_password_otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      if (customer.reset_password_otp_expires < now) {
        return res.status(400).json({ message: "OTP has expired" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(new_password, 10);

      // Update the password and clear OTP fields
      const orgMail = getOrgMail();
      await pool.query(
        "UPDATE Customer SET Password = ?, reset_password_otp = NULL, reset_password_otp_expires = NULL WHERE idCustomer = ? AND orgmail = ?",
        [hashedPassword, customer.idCustomer, orgMail]
      );

      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Error in resetPassword:", error);
      res
        .status(500)
        .json({ message: "Failed to reset password", error: error.message });
    }
  }

  // Get current customer data
  async getMe(req, res) {
    try {
      const customerId = req.user.customerId;
      const customer = await Customer.getCustomerById(customerId);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json({
        id: customer.idCustomer,
        email: customer.Email,
        name: customer.Full_Name,
      });
    } catch (error) {
      console.error("Error in getMe:", error);
      res
        .status(500)
        .json({ message: "Failed to get customer data", error: error.message });
    }
  }
}

module.exports = new CustomerAuthController();
