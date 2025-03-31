const User = require('../../models/user.model');
const Customer = require('../../models/customer.model');
const pool = require('../../config/database');

// Customer Authentication Controller
class CustomerAuthController {
  // Register a new customer
  async register(req, res) {
    try {
      const { first_name, full_name, email, password, mobile_no, status } = req.body;
      
      // Check if email is already used
      const existingCustomers = await Customer.findByEmail(email);
      if (existingCustomers.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      const customerId = await Customer.create({
        first_name,
        full_name,
        email,
        password,
        mobile_no,
        status
      });
      
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
      res.json({ user: rows[0], message: 'Login successful' });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  }

  // Request password reset
  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;
      
      // Check if customer exists
      const customers = await Customer.findByEmail(email);
      if (customers.length === 0) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      
      // In a real application, you would:
      // 1. Generate a unique reset token
      // 2. Store it in the database with an expiration time
      // 3. Send an email to the customer with a reset link containing the token
      
      // For demo purposes, we'll just return a success message
      res.json({ message: 'Password reset instructions sent to your email', customer_id: customers[0].idCustomer });
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
      
      // Update the password
      const result = await Customer.updatePassword(customer_id, new_password);
      
      if (result === 0) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      
      res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to reset password', error: error.message });
    }
  }
}

module.exports = new CustomerAuthController(); 