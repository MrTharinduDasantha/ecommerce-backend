const User = require('../../models/user.model');

// Admin Authentication Controller
class AdminAuthController {
  // Login admin user
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      const user = await User.authenticate(email, password);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      res.json({
        user,
        token: 'admin-token-' + user.id, // This is a placeholder. In production, use JWT
        message: 'Login successful'
      });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  }
}

module.exports = new AdminAuthController(); 