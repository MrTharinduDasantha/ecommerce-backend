const User = require('../../models/user.model');
const Customer = require('../../models/customer.model');
const pool = require('../../config/database');
const jwt = require('jsonwebtoken');

// Customer Authentication Controller
class CustomerAuthController {
  // Register a new customer
  async register(req, res) {
    try {
      const { first_name, full_name, email, password, mobile_no, status } = req.body;
      
      // Check if email is already used
      const existingCustomer = await Customer.getCustomerByEmail(email);
      if (existingCustomer) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      // These parameters need to match the addCustomer function in the model
      // Adjusting for default nulls for address, city, country
      const customerId = await Customer.addCustomer(
        first_name,
        full_name,
        null, // address
        null, // city
        null, // country
        mobile_no,
        status,
        email,
        password
      );
      
      res.status(201).json({ id: customerId, message: 'Customer registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Registration failed', error: error.message });
    }
  }

  // Login as a customer
  async login(req, res) {
    try {
      const { email, password } = req.body;
      // Use Customer table instead of User table
      const [rows] = await pool.query('SELECT * FROM Customer WHERE Email = ? AND Password = ?', [email, password]);
      if (rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const customer = rows[0];
      
      // Generate JWT token
      const secretKey = process.env.JWT_SECRET || 'your-secret-key';
      const token = jwt.sign(
        { 
          customerId: customer.idCustomer, 
          email: customer.Email,
          role: 'customer'
        }, 
        secretKey, 
        { expiresIn: '24h' }
      );
      
      res.json({ 
        user: {
          id: customer.idCustomer,
          email: customer.Email,
          name: customer.Full_Name
        },
        token: token,
        message: 'Login successful'
      });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  }

  // Request password reset
  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;
      
      // Check if customer exists
      const customer = await Customer.getCustomerByEmail(email);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      
      // In a real application, you would:
      // 1. Generate a unique reset token
      // 2. Store it in the database with an expiration time
      // 3. Send an email to the customer with a reset link containing the token
      
      // For demo purposes, we'll just return a success message
      res.json({ message: 'Password reset instructions sent to your email', customer_id: customer.idCustomer });
    } catch (error) {
      res.status(500).json({ message: 'Failed to request password reset', error: error.message });
    }
  }

  // Reset password
  async resetPassword(req, res) {
    try {
      const { customer_id, new_password } = req.body;
      
      // In a real application, you would:
      // 1. Verify the reset token from the request
      // 2. Check if the token is valid and not expired
      
      // Get the customer to check if it exists
      const customer = await Customer.getCustomerById(customer_id);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      
      // Update the password
      await Customer.updateCustomer(customer_id, { password: new_password });
      
      res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to reset password', error: error.message });
    }
  }
}

module.exports = new CustomerAuthController(); 