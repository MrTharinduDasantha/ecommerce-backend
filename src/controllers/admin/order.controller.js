const Order = require('../../models/order.model');
const pool = require('../../config/database');

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
      console.error('Error in getAllOrders:', error);
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
      const { status, customerName, orderTotal } = req.body;
      const orderId = req.params.id;
      
      if (!['Order Confirmed', 'Order Packed', 'Awaiting Delivery', 'Out for Delivery', 'Delivered'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      // Get the current order details
      const [currentOrder] = await pool.query(
        'SELECT Status, Total_Amount, Date_Time FROM `Order` WHERE idOrder = ?',
        [orderId]
      );

      if (!currentOrder.length) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Update the order status
      const affectedRows = await Order.updateStatus(orderId, status);
      
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Log the admin action with original and updated data
      const logData = {
        originalData: {
          status: currentOrder[0].Status,
          total_amount: currentOrder[0].Total_Amount,
          order_date: currentOrder[0].Date_Time,
          customer_name: customerName
        },
        updatedData: {
          status: status,
          total_amount: orderTotal,
          order_date: currentOrder[0].Date_Time,
          customer_name: customerName
        }
      };

      await pool.query(
        'INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)',
        [
          req.user.userId,
          'Updated order status',
          req.headers['user-agent'],
          JSON.stringify(logData)
        ]
      );
      
      res.json({ message: 'Order status updated successfully' });
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
      res.status(500).json({ message: 'Failed to update order status', error: error.message });
    }
  }

  // Update payment status
  async updatePaymentStatus(req, res) {
    try {
      const { paymentStatus, customerName, orderTotal } = req.body;
      const orderId = req.params.id;
      
      if (!['pending', 'paid', 'failed', 'cancelled', 'refunded'].includes(paymentStatus)) {
        return res.status(400).json({ message: 'Invalid payment status' });
      }

      // Get the current order details
      const [currentOrder] = await pool.query(
        'SELECT Payment_Stats, Total_Amount, Date_Time FROM `Order` WHERE idOrder = ?',
        [orderId]
      );

      if (!currentOrder.length) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Update the payment status
      const affectedRows = await Order.updatePaymentStatus(orderId, paymentStatus);
      
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Log the admin action with original and updated data
      const logData = {
        originalData: {
          paymentStatus: currentOrder[0].Payment_Stats,
          total_amount: currentOrder[0].Total_Amount,
          order_date: currentOrder[0].Date_Time,
          customer_name: customerName
        },
        updatedData: {
          paymentStatus: paymentStatus,
          total_amount: orderTotal,
          order_date: currentOrder[0].Date_Time,
          customer_name: customerName
        }
      };

      await pool.query(
        'INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)',
        [
          req.user.userId,
          'Updated payment status',
          req.headers['user-agent'],
          JSON.stringify(logData)
        ]
      );
      
      res.json({ message: 'Payment status updated successfully' });
    } catch (error) {
      console.error('Error in updatePaymentStatus:', error);
      res.status(500).json({ message: 'Failed to update payment status', error: error.message });
    }
  }

  async getOrderCountByStatus(req, res) {
    try {
        const orderCountByStatus = await Order.countByStatus();
        res.json(orderCountByStatus);
    } catch (error) {
        console.error('Error in getOrderCountByStatus:', error);
        res.status(500).json({ message: 'Failed to fetch order counts by status', error: error.message });
    }
  }
}

module.exports = new OrderController();