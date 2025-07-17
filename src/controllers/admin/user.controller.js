const User = require("../../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Importing JWT
const { sendConfirmationEmail, sendOtpEmail } = require("../../utils/mailer");
const pool = require("../../config/database");
const { getOrgMail } = require('../../utils/organization');

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Get a single user
const getUser = async (req, res) => {
  try {
    console.log("Fetching user with ID:", req.params.id); // Log the ID
    const user = await User.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Add a new user
const createUser = async (req, res) => {
  try {
    const { full_name, email, password, phone_no, status } = req.body;

    // Validate required fields
    if (!full_name || !email || !password || !phone_no) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email already exists
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.addUser(
      full_name,
      email,
      hashedPassword,
      phone_no,
      status || "Active"
    );

    // Log admin action
    const newUserInfo = { full_name, email, phone_no };
    await logAdminAction(
      req.user.userId,
      "Added new user",
      req.headers["user-agent"],
      JSON.stringify(newUserInfo)
    );

    res.status(201).json({ id: userId, message: "User added successfully" });
  } catch (error) {
    console.error("createUser error:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};
// Update user
const updateUser = async (req, res) => {
  try {
    const { full_name, email, phone_no, status } = req.body;

    // Validate email format if necessary
    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Update user in the database
    await User.updateUser(req.params.id, full_name, email, phone_no, status);

    // Send confirmation email after the update
    sendConfirmationEmail(email); // Send email confirmation

    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

// Validate email format
const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return re.test(email);
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    await User.deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    console.log("User info from JWT:", req.user); // This should print user info like { userId: 2 }
    const user = await User.getUserById(req.user.userId); // Fetch user based on decoded userId
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error); // Log the error
    res.status(500).json({ error: "Database error" });
  }
};

// Update user status
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.params.id;

    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const orgMail = getOrgMail();
    const query = "UPDATE User SET status = ? WHERE idUser = ? AND orgmail = ?";
    const values = [status, userId, orgMail];
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating status" });
  }
};

// Update user password
const updateUserPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
    const orgMail = getOrgMail();
    await pool.query("UPDATE User SET Password = ? WHERE idUser = ? AND orgmail = ?", [
      hashedPassword,
      id,
      orgMail
    ]);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Error updating password" });
  }
};

// Log admin action
const logAdminAction = async (
  adminId,
  action,
  deviceInfo,
  newUserInfo = null
) => {
  console.log("Logging action", { adminId, action, deviceInfo, newUserInfo }); // Add this line
  const orgMail = getOrgMail();
  const query =
    "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info, orgmail) VALUES (?, ?, ?, ?, ?)";
  await pool.query(query, [adminId, action, deviceInfo, newUserInfo, orgMail]);
};
const getAdminLogs = async (req, res) => {
  try {
    const orgMail = getOrgMail();
    const [logs] = await pool.query(
      `
          SELECT admin_logs.*, User.Full_Name AS Admin_Name,
          admin_logs.new_user_info AS User_Details
          FROM admin_logs
          JOIN User ON admin_logs.admin_id = User.idUser
          WHERE admin_logs.orgmail = ?
          ORDER BY timestamp DESC
          `,
      [orgMail]
    );
    console.log("Admin Logs:", logs); // Log what you retrieve from the database
    res.json(logs);
  } catch (error) {
    console.error("Error fetching admin logs:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Login user


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.getUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if user is inactive
    if (user.Status !== "Active") {
      return res
        .status(403)
        .json({ error: "Your account is inactive. Please contact admin." });
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.idUser },
      process.env.JWT_SECRET || "your-secret-key",
      {
        expiresIn: "1d",
      }
    );

    await logAdminAction(user.idUser, "Logged In", req.headers["user-agent"]);

    res.json({
      message: "Login successful",
      userId: user.idUser,
      fullName: user.Full_Name,
      email: user.Email,
      phoneNo: user.Phone_No,
      status: user.Status,
      token: token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request password reset
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if user exists
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP in the database
    await User.saveOtp(email, otp);

    // Send OTP via email
    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    // Check if OTP is valid
    const user = await User.verifyOtp(email, otp);
    if (!user) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ error: "Email, OTP and new password are required" });
    }

    // Verify OTP again
    const user = await User.verifyOtp(email, otp);
    if (!user) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.updatePassword(email, hashedPassword);

    // Clear OTP
    await User.clearOtp(email);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
};

// Logout function (optional, if you support logout)
const logoutAdmin = async (adminId) => {
  await logAdminAction(adminId, "Logged Out", "Logout");
};
const deleteLog = async (req, res) => {
  try {
    const logId = req.params.id;
    const orgMail = getOrgMail();
    await pool.query('DELETE FROM admin_logs WHERE log_id = ? AND orgmail = ?', [logId, orgMail]);
    res.json({ message: 'Log deleted successfully' });
  } catch (error) {
    console.error("Error deleting log:", error);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  loginUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
  deleteUser,
  getProfile,
  updateUserStatus,
  updateUserPassword,
  getAdminLogs,
  logoutAdmin,
  deleteLog
};
