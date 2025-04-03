const Order = require('../../models/order.model');

// Admin Orders Controller
class OrderController {
  // Get all orders with pagination
  async getAllOrders(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      const orders = await Order.findAll(limit, offset);
      const totalOrders = await Order.count();
      
      res.json({
        orders,
        pagination: {
          page,
          limit,
          totalOrders,
          totalPages: Math.ceil(totalOrders / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
  }

  // Get order details by ID
  async getOrderById(req, res) {
    try {
      const id = req.params.id;
      console.log(`Requested order ID: ${id}`);
      
      if (!id) {
        return res.status(400).json({ message: 'Order ID is required' });
      }
      
      // Validate if id is numeric before calling the model
      if (isNaN(parseInt(id, 10))) {
        console.error(`Invalid order ID format: ${id}`);
        return res.status(400).json({ message: 'Invalid order ID format, must be a number' });
      }
      
      const orderDetails = await Order.findById(id);
      
      if (!orderDetails) {
        console.log(`Order with ID ${id} not found`);
        return res.status(404).json({ message: 'Order not found' });
      }
      
      console.log(`Successfully retrieved order ${id}`);
      res.json(orderDetails);
    } catch (error) {
      console.error(`Error in getOrderById: ${error.message}`);
      res.status(500).json({ message: 'Failed to fetch order details', error: error.message });
    }
  }

  // Update order status
  async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;
      
      if (!['Order Confirmed', 'Order Packed', 'Awaiting Delivery', 'Out for Delivery', 'Delivered'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      
      const affectedRows = await Order.updateStatus(req.params.id, status);
      
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.json({ message: 'Order status updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update order status', error: error.message });
    }
  }
}

module.exports = new OrderController(); 