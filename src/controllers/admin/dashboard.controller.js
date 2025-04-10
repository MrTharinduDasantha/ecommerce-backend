const Customer = require('../../models/customer.model');
const Product = require('../../models/product.model');
const Order = require('../../models/order.model');

// Admin Dashboard Controller
class DashboardController {
  // Get dashboard statistics
  async getStats(req, res) {
    try {
      // Get total users
      const userCount = await Customer.count();
      
      // Get total products
      const productCount = await Product.count();
      
      // Get total orders
      const orderCount = await Order.count();
      
      // Get total revenue
      const revenue = await Order.getTotalRevenue();
      
      // Get recent orders
      const recentOrders = await Order.getRecentOrders();
      
      // Get sales data for chart (last 7 days)
      const salesData = await Order.getSalesData();
      
      res.json({
        userCount,
        productCount,
        orderCount,
        revenue,
        recentOrders,
        salesData
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
    }
  }
}

module.exports = new DashboardController(); 