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
}

module.exports = new CustomerAuthController(); 