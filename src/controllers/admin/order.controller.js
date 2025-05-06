const Order = require("../../models/order.model");
const pool = require("../../config/database");

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
          totalPages: Math.ceil(totalOrders / limit),
        },
      });
    } catch (error) {
      console.error("Error in getAllOrders:", error);
      res
        .status(500)
        .json({ message: "Failed to fetch orders", error: error.message });
    }
  }

  // Get order details by ID
  async getOrderById(req, res) {
    try {
      const id = req.params.id;
      console.log(`Requested order ID: ${id}`);

      if (!id) {
        return res.status(400).json({ message: "Order ID is required" });
      }

      // Validate if id is numeric before calling the model
      if (isNaN(parseInt(id, 10))) {
        console.error(`Invalid order ID format: ${id}`);
        return res
          .status(400)
          .json({ message: "Invalid order ID format, must be a number" });
      }

      const orderDetails = await Order.findById(id);

      if (!orderDetails) {
        console.log(`Order with ID ${id} not found`);
        return res.status(404).json({ message: "Order not found" });
      }

      console.log(`Successfully retrieved order ${id}`);
      res.json(orderDetails);
    } catch (error) {
      console.error(`Error in getOrderById: ${error.message}`);
      res.status(500).json({
        message: "Failed to fetch order details",
        error: error.message,
      });
    }
  }

  // Update order status
  async updateOrderStatus(req, res) {
    try {
      const { status, customerName, orderTotal, reason } = req.body;
      const orderId = req.params.id;

      if (
        ![
          "Order Confirmed",
          "Order Packed",
          "Awaiting Delivery",
          "Out for Delivery",
          "Delivered",
          "Cancelled",
        ].includes(status)
      ) {
        return res.status(400).json({ message: "Invalid status" });
      }

      // Get the current order details
      const [currentOrder] = await pool.query(
        "SELECT Status, Total_Amount, Date_Time FROM `Order` WHERE idOrder = ?",
        [orderId]
      );

      if (!currentOrder.length) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Get admin email
      const [adminData] = await pool.query(
        "SELECT Email FROM User WHERE idUser = ?",
        [req.user.userId]
      );

      const adminEmail = adminData[0]?.Email || "admin";

      // Update the order status
      const affectedRows = await Order.updateStatus(orderId, status);

      if (affectedRows === 0) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Log the admin action with original and updated data
      const logData = {
        originalData: {
          status: currentOrder[0].Status,
          total_amount: currentOrder[0].Total_Amount,
          order_date: currentOrder[0].Date_Time,
          customer_name: customerName,
        },
        updatedData: {
          status: status,
          total_amount: orderTotal,
          order_date: currentOrder[0].Date_Time,
          customer_name: customerName,
        },
      };

      await pool.query(
        "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
        [
          req.user.userId,
          "Updated order status",
          req.headers["user-agent"],
          JSON.stringify(logData),
        ]
      );

      // Add record to Order_History table
      const statusType = status === "Cancelled" ? "cancellation" : "order_status";
      await pool.query(
        "INSERT INTO Order_History (order_id, status_from, status_to, status_type, reason, notes, changed_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          orderId,
          currentOrder[0].Status,
          status,
          statusType,
          reason || null,
          `Updated by ${adminEmail}`,
          req.user.userId,
        ]
      );

      res.json({ message: "Order status updated successfully" });
    } catch (error) {
      console.error("Error in updateOrderStatus:", error);
      res.status(500).json({
        message: "Failed to update order status",
        error: error.message,
      });
    }
  }

  // Update payment status
  async updatePaymentStatus(req, res) {
    try {
      const { paymentStatus, customerName, orderTotal, reason } = req.body;
      const orderId = req.params.id;

      const validStatuses = [
        "pending",
        "paid",
        "failed",
        "cancelled",
        "refunded",
      ];
      if (!validStatuses.includes(paymentStatus)) {
        return res.status(400).json({ message: "Invalid payment status" });
      }

      // Get current payment status and admin email
      const [currentOrder] = await pool.query(
        "SELECT Payment_Stats FROM `Order` WHERE idOrder = ?",
        [orderId]
      );

      if (!currentOrder.length) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Get admin email
      const [adminData] = await pool.query(
        "SELECT Email FROM User WHERE idUser = ?",
        [req.user.userId]
      );

      const adminEmail = adminData[0]?.Email || "admin";

      const affectedRows = await Order.updatePaymentStatus(
        orderId,
        paymentStatus
      );

      if (affectedRows === 0) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Log the admin action
      const logData = {
        orderId,
        updatedPaymentStatus: paymentStatus,
      };

      await pool.query(
        "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)",
        [
          req.user.userId,
          "Updated payment status",
          req.headers["user-agent"],
          JSON.stringify(logData),
        ]
      );

      // Add record to Order_History table
      await pool.query(
        "INSERT INTO Order_History (order_id, status_from, status_to, status_type, reason, notes, changed_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          orderId,
          currentOrder[0].Payment_Stats,
          paymentStatus,
          "payment_status",
          reason || null,
          `Updated by ${adminEmail}`,
          req.user.userId,
        ]
      );

      res.json({ message: "Payment status updated successfully" });
    } catch (error) {
      console.error("Error in updatePaymentStatus:", error);
      res.status(500).json({
        message: "Failed to update payment status",
        error: error.message,
      });
    }
  }

  // get order count by status
  async getOrderCountByStatus(req, res) {
    try {
      const orderCountByStatus = await Order.countByStatus();
      res.json(orderCountByStatus);
    } catch (error) {
      console.error("Error in getOrderCountByStatus:", error);
      res.status(500).json({
        message: "Failed to fetch order counts by status",
        error: error.message,
      });
    }
  }

  // get pending delivery count
  async getPendingDeliveryCount(req, res) {
    try {
      const pendingCount = await Order.countPendingDelivery();
      res.json({ pendingDeliveryCount: pendingCount });
    } catch (error) {
      console.error("Error in getPendingDeliveryCount:", error);
      res.status(500).json({
        message: "Failed to fetch pending delivery count",
        error: error.message,
      });
    }
  }

// Get Total Revenue 
async getTotalRevenue(req, res) {
  try {
    const totalRevenue = await Order.getTotalRevenue();
    res.json({ totalRevenue });
  } catch (error) {
    console.error("Error in getTotalRevenue:", error);
    res.status(500).json({
      message: "Failed to fetch total revenue",
      error: error.message,
    });
  }
}

// Get Monthly Total Revenue
async getMonthlyTotalRevenue(req, res) {
  try {
    const monthlyRevenue = await Order.getMonthlyTotalRevenue();
    res.json(monthlyRevenue); // This is an array of monthly revenue
  } catch (error) {
    console.error("Error in getMonthlyTotalRevenue:", error);
    res.status(500).json({
      message: "Failed to fetch monthly total revenue",
      error: error.message,
    });
  }
}

// Get order history
async getOrderHistory(req, res) {
  try {
    const orderId = req.params.id;
    
    // Validate if id is numeric
    if (isNaN(parseInt(orderId, 10))) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    // Get order history from Order_History table
    const [history] = await pool.query(
      `SELECT oh.*, u.Full_Name as changed_by_name
       FROM Order_History oh
       LEFT JOIN User u ON oh.changed_by = u.idUser
       WHERE oh.order_id = ?
       ORDER BY oh.created_at DESC`,
      [orderId]
    );

    res.json(history);
  } catch (error) {
    console.error(`Error in getOrderHistory: ${error.message}`);
    res.status(500).json({
      message: "Failed to fetch order history",
      error: error.message,
    });
  }
}
}

module.exports = new OrderController();
