const Customer = require('../../models/customer.model');

// Admin User Management Controller
class UserController {
  // Get all users with pagination
  async getAllUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      const users = await Customer.findAll(limit, offset);
      const totalUsers = await Customer.count();
      
      res.json({
        users,
        pagination: {
          page,
          limit,
          totalUsers,
          totalPages: Math.ceil(totalUsers / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
  }

  // Update user status
  async updateUserStatus(req, res) {
    try {
      const { status } = req.body;
      
      if (!['active', 'inactive', 'blocked'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      
      const affectedRows = await Customer.updateStatus(req.params.id, status);
      
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ message: 'User status updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update user status', error: error.message });
    }
  }

  // Get roles (placeholder for future implementation)
  async getRoles(req, res) {
    try {
      // For now, just return predefined roles
      // In a real application, this would come from a database
      const roles = [
        { id: 1, name: 'Super Admin', permissions: ['all'] },
        { id: 2, name: 'Manager', permissions: ['read', 'write'] },
        { id: 3, name: 'Staff', permissions: ['read'] }
      ];
      
      res.json({ roles });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch roles', error: error.message });
    }
  }
}

module.exports = new UserController(); 