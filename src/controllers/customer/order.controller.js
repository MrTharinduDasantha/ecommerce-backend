const Order = require("../../models/order.model")
const Cart = require("../../models/cart.model")
const pool = require("../../config/database")
const nodemailer = require("nodemailer")

// Create transporter for emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Customer Order Controller
class OrderController {
  // Get customer orders
  async getCustomerOrders(req, res) {
    try {
      console.log("Getting orders for customer ID:", req.params.customer_id)
      const orders = await Order.findByCustomerId(req.params.customer_id)
      res.json(orders)
    } catch (error) {
      console.error("Error fetching orders:", error)
      res
        .status(500)
        .json({ message: "Failed to fetch orders", error: error.message })
    }
  }

  // Get order details by ID (for customers)
  async getOrderDetails(req, res) {
    try {
      const orderId = parseInt(req.params.id, 10)
      const customerId = parseInt(req.params.customer_id, 10)

      if (isNaN(orderId) || isNaN(customerId)) {
        return res
          .status(400)
          .json({ message: "Invalid order ID or customer ID" })
      }

      console.log(
        "Getting order details for order ID:",
        orderId,
        "customer ID:",
        customerId
      )

      // First check if the order belongs to this customer for security
      const [orderCheck] = await pool.query(
        `SELECT o.* FROM \`Order\` o 
         JOIN Delivery_Address da ON o.Delivery_Address_idDelivery_Address = da.idDelivery_Address
         JOIN Customer c ON da.Customer_idCustomer = c.idCustomer
         WHERE o.idOrder = ? AND c.idCustomer = ?`,
        [orderId, customerId]
      )

      if (orderCheck.length === 0) {
        return res.status(404).json({
          message: "Order not found or not authorized to view this order",
        })
      }

      // Get full order details including items
      const orderDetails = await Order.findById(orderId)

      if (!orderDetails) {
        return res.status(404).json({ message: "Order details not found" })
      }

      res.json(orderDetails)
    } catch (error) {
      console.error("Error fetching order details:", error)
      res.status(500).json({
        message: "Failed to fetch order details",
        error: error.message,
      })
    }
  }

  // Track order status
  async trackOrderStatus(req, res) {
    try {
      const orderId = parseInt(req.params.id, 10)
      const customerId = parseInt(req.params.customer_id, 10)

      if (isNaN(orderId) || isNaN(customerId)) {
        return res
          .status(400)
          .json({ message: "Invalid order ID or customer ID" })
      }

      console.log(
        "Tracking order status for order ID:",
        orderId,
        "customer ID:",
        customerId
      )

      // First check if the order belongs to this customer
      const [orderCheck] = await pool.query(
        `SELECT o.* FROM \`Order\` o 
         JOIN Delivery_Address da ON o.Delivery_Address_idDelivery_Address = da.idDelivery_Address
         JOIN Customer c ON da.Customer_idCustomer = c.idCustomer
         WHERE o.idOrder = ? AND c.idCustomer = ?`,
        [orderId, customerId]
      )

      if (orderCheck.length === 0) {
        return res.status(404).json({
          message: "Order not found or not authorized to track this order",
        })
      }

      // Get the order status history
      const [statusHistory] = await pool.query(
        `SELECT 
           oh.id, 
           oh.status_from, 
           oh.status_to, 
           oh.status_type, 
           oh.created_at, 
           oh.notes
         FROM Order_History oh
         WHERE oh.order_id = ?
         ORDER BY oh.created_at DESC`,
        [orderId]
      )

      // Get current order status
      const [currentStatus] = await pool.query(
        `SELECT 
           o.Status as order_status, 
           o.Payment_Stats as payment_status, 
           o.Delivery_Status as delivery_status,
           o.Delivery_Date as delivery_date,
           o.Date_Time as order_date
         FROM \`Order\` o
         WHERE o.idOrder = ?`,
        [orderId]
      )

      res.json({
        order_id: orderId,
        current_status: currentStatus[0] || {},
        status_history: statusHistory,
      })
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to track order status", error: error.message })
    }
  }

  // Get order history for a customer
  async getOrderHistory(req, res) {
    try {
      const customerId = parseInt(req.params.customer_id, 10)

      if (isNaN(customerId)) {
        return res.status(400).json({ message: "Invalid customer ID" })
      }

      console.log("Getting order history for customer ID:", customerId)

      // Get all orders for this customer with most recent first
      const [orders] = await pool.query(
        `SELECT 
           o.idOrder, 
           o.Date_Time as order_date, 
           o.Total_Amount, 
           o.Delivery_Charges, 
           o.Net_Amount, 
           o.Payment_Type, 
           o.Payment_Stats as payment_status,
           o.Status as order_status, 
           o.Delivery_Status as delivery_status,
           o.Delivery_Date as delivery_date
         FROM \`Order\` o
         JOIN Delivery_Address da ON o.Delivery_Address_idDelivery_Address = da.idDelivery_Address
         JOIN Customer c ON da.Customer_idCustomer = c.idCustomer
         WHERE c.idCustomer = ?
         ORDER BY o.Date_Time DESC`,
        [customerId]
      )

      // For each order, get a preview of items (limited to first 3)
      const ordersWithItems = await Promise.all(
        orders.map(async order => {
          const [items] = await pool.query(
            `SELECT 
               ohpv.Product_Variations_idProduct_Variations,
               ohpv.Qty,
               ohpv.Rate,
               ohpv.Total_Amount,
               p.Description as product_name,
               p.Main_Image_Url as product_image
             FROM Order_has_Product_Variations ohpv
             JOIN Product_Variations pv ON ohpv.Product_Variations_idProduct_Variations = pv.idProduct_Variations
             JOIN Product p ON pv.Product_idProduct = p.idProduct
             WHERE ohpv.Order_idOrder = ?
             LIMIT 3`,
            [order.idOrder]
          )

          // Get the total number of items
          const [itemCount] = await pool.query(
            `SELECT COUNT(*) as total_items
             FROM Order_has_Product_Variations
             WHERE Order_idOrder = ?`,
            [order.idOrder]
          )

          return {
            ...order,
            items: items,
            total_items: itemCount[0].total_items,
          }
        })
      )

      res.json(ordersWithItems)
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch order history",
        error: error.message,
      })
    }
  }

  // Create new order
  async createOrder(req, res) {
    try {
      const {
        customer_id,
        delivery_address_id,
        cart_id,
        delivery_type,
        payment_type,
      } = req.body
      const authenticatedCustomerId = req.user.customerId // Assuming JWT middleware sets req.user.customerId

      // Security check: Ensure the customer_id from the body matches the authenticated user
      if (parseInt(customer_id, 10) !== authenticatedCustomerId) {
        return res.status(403).json({
          message:
            "Unauthorized: customer_id does not match authenticated user.",
        })
      }

      // Get cart data
      const cartData = await Cart.getCartByCustomerId(customer_id)
      if (!cartData || cartData.items.length === 0) {
        return res.status(404).json({ message: "Cart not found or is empty" })
      }

      let finalDeliveryAddressId = delivery_address_id

      // If delivery_address_id is provided, verify it belongs to the customer
      if (delivery_address_id) {
        const [addressCheck] = await pool.query(
          "SELECT idDelivery_Address FROM Delivery_Address WHERE idDelivery_Address = ? AND Customer_idCustomer = ?",
          [delivery_address_id, customer_id]
        )
        if (addressCheck.length === 0) {
          return res.status(400).json({
            message:
              "Provided delivery address does not belong to this customer or does not exist.",
          })
        }
      } else {
        // If no delivery_address_id is provided, try to get a default one for the customer
        const [defaultAddresses] = await pool.query(
          "SELECT idDelivery_Address FROM Delivery_Address WHERE Customer_idCustomer = ? ORDER BY idDelivery_Address LIMIT 1",
          [customer_id]
        )
        if (defaultAddresses.length > 0) {
          finalDeliveryAddressId = defaultAddresses[0].idDelivery_Address
        } else {
          return res.status(400).json({
            message:
              "No delivery address provided and no default delivery address found for this customer.",
          })
        }
      }

      const total_amount = cartData.Total_Amount
      const delivery_charges = delivery_type === "express" ? 10 : 5 // Example charges
      const net_amount = parseFloat(total_amount) + delivery_charges

      const order_id = await Order.create({
        delivery_address_id: finalDeliveryAddressId, // Use the verified/fetched address ID
        total_amount,
        delivery_type,
        delivery_charges,
        net_amount,
        payment_type,
      })

      for (const item of cartData.items) {
        await Order.addOrderItem({
          order_id,
          product_variation_id: item.Product_Variations_idProduct_Variations,
          rate: item.Rate,
          qty: item.CartQty,
          total: item.Total_Amount,
          discount_percentage: item.Discount_Percentage || 0,
          discount_amount: item.Discount_Amount || 0,
          total_amount: item.NetAmount, // Use NetAmount from cart item
        })

        //update product SIH and sold_qty
        await pool.query(
          `UPDATE Product p JOIN Product_Variations pv ON p.idProduct = pv.Product_idProduct SET p.SIH = p.SIH - ?, p.Sold_Qty = p.Sold_Qty + ? WHERE pv.idProduct_Variations = ?`,
          [
            item.CartQty,
            item.CartQty,
            item.Product_Variations_idProduct_Variations,
          ]
        )
        //update SIH in the Product_Variations table
        await pool.query(
          `UPDATE Product_Variations SET SIH = SIH - ? WHERE idProduct_Variations = ?`,
          [item.CartQty, item.Product_Variations_idProduct_Variations]
        )
      }

      await Cart.clearCart(cart_id)

      await pool.query(
        "INSERT INTO Order_History (order_id, status_from, status_to, status_type, notes) VALUES (?, ?, ?, ?, ?)",
        [
          order_id,
          null,
          "Order Placed",
          "order_status",
          "Order placed by customer",
        ]
      )

      res.status(201).json({ order_id, message: "Order created successfully" })
    } catch (error) {
      console.error("Error creating order:", error)
      res
        .status(500)
        .json({ message: "Failed to create order", error: error.message })
    }
  }

  // Cancel order (customer-initiated)
  async cancelOrder(req, res) {
    try {
      const orderId = parseInt(req.params.id, 10)
      const customerId = parseInt(req.params.customer_id, 10)
      const { reason } = req.body

      if (isNaN(orderId) || isNaN(customerId)) {
        return res
          .status(400)
          .json({ message: "Invalid order ID or customer ID" })
      }

      console.log(
        "Cancelling order ID:",
        orderId,
        "for customer ID:",
        customerId
      )

      // Check if the order belongs to this customer
      const [orderCheck] = await pool.query(
        `SELECT o.* FROM \`Order\` o 
         JOIN Delivery_Address da ON o.Delivery_Address_idDelivery_Address = da.idDelivery_Address
         JOIN Customer c ON da.Customer_idCustomer = c.idCustomer
         WHERE o.idOrder = ? AND c.idCustomer = ?`,
        [orderId, customerId]
      )

      if (orderCheck.length === 0) {
        return res.status(404).json({
          message: "Order not found or not authorized to cancel this order",
        })
      }

      // Check if order is in a state that can be cancelled (not already delivered, cancelled, etc.)
      if (
        orderCheck[0].Status === "Delivered" ||
        orderCheck[0].Status === "Cancelled"
      ) {
        return res.status(400).json({
          message: `Cannot cancel order in '${orderCheck[0].Status}' status`,
        })
      }

      // Update order status to Cancelled
      await Order.updateStatus(orderId, "Cancelled")

      // Add record to Order_History
      await pool.query(
        "INSERT INTO Order_History (order_id, status_from, status_to, status_type, reason, notes) VALUES (?, ?, ?, ?, ?, ?)",
        [
          orderId,
          orderCheck[0].Status,
          "Cancelled",
          "cancellation",
          reason || "No reason provided",
          "Cancelled by customer",
        ]
      )

      res.json({ message: "Order cancelled successfully" })
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to cancel order", error: error.message })
    }
  }

  // Send invoice via email
  async sendInvoiceEmail(req, res) {
    try {
      const orderId = parseInt(req.params.id, 10)
      const customerId = parseInt(req.params.customer_id, 10)
      const { emailAddress, pdfBase64 } = req.body

      // Check if email credentials are configured
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Email credentials not configured:", {
          EMAIL_USER: process.env.EMAIL_USER ? "Set" : "Not set",
          EMAIL_PASS: process.env.EMAIL_PASS ? "Set" : "Not set",
        })
        return res.status(500).json({
          message:
            "Email service not configured. Please contact administrator.",
        })
      }

      if (isNaN(orderId) || isNaN(customerId)) {
        return res
          .status(400)
          .json({ message: "Invalid order ID or customer ID" })
      }

      if (!emailAddress) {
        return res.status(400).json({ message: "Email address is required" })
      }

      if (!pdfBase64) {
        return res.status(400).json({ message: "PDF data is required" })
      }

      console.log(
        "Sending invoice email for order ID:",
        orderId,
        "to:",
        emailAddress
      )

      // Check if the order belongs to this customer
      const [orderCheck] = await pool.query(
        `SELECT o.* FROM \`Order\` o 
         JOIN Delivery_Address da ON o.Delivery_Address_idDelivery_Address = da.idDelivery_Address
         JOIN Customer c ON da.Customer_idCustomer = c.idCustomer
         WHERE o.idOrder = ? AND c.idCustomer = ?`,
        [orderId, customerId]
      )

      if (orderCheck.length === 0) {
        return res.status(404).json({
          message:
            "Order not found or not authorized to send invoice for this order",
        })
      }

      // Convert base64 PDF to buffer
      const pdfBuffer = Buffer.from(pdfBase64, "base64")

      // Email content
      const subject = `Invoice for Order #${orderId} - Asipiya`
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #1D372E; margin-bottom: 5px;">Asipiya Order Invoice</h2>
            <p style="color: #666;">Thank you for your order!</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #5CAF90; margin-top: 0;">Order Details:</h3>
            <p><strong>Order #:</strong> ${orderId}</p>
            <p><strong>Order Date:</strong> ${new Date(
              orderCheck[0].Date_Time
            ).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> $${orderCheck[0].Net_Amount}</p>
            <p><strong>Payment Status:</strong> ${
              orderCheck[0].Payment_Stats
            }</p>
            <p><strong>Delivery Status:</strong> ${
              orderCheck[0].Delivery_Status
            }</p>
          </div>
          
          <p style="color: #666; margin-bottom: 20px;">
            Please find your detailed invoice attached to this email. If you have any questions about your order, 
            please don't hesitate to contact our customer support team.
          </p>
          
          <p style="color: #666; margin-bottom: 20px;">
            Thank you for choosing Asipiya!
          </p>
          
          <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
            <p>© ${new Date().getFullYear()} Asipiya. All rights reserved.</p>
          </div>
        </div>
      `

      // Email options
      const mailOptions = {
        from: `"Asipiya" <${process.env.EMAIL_USER}>`,
        to: emailAddress,
        subject: subject,
        html: htmlContent,
        attachments: [
          {
            filename: `Order-${orderId}-Invoice.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      }

      // Send email
      await transporter.sendMail(mailOptions)

      console.log("Invoice email sent successfully to:", emailAddress)
      res.json({
        message: "Invoice sent successfully to the provided email address",
      })
    } catch (error) {
      console.error("Error sending invoice email:", error)
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        code: error.code,
        command: error.command,
      })
      res
        .status(500)
        .json({ message: "Failed to send invoice email", error: error.message })
    }
  }
}

module.exports = new OrderController()
