const pool = require("../config/database")
const { getOrgMail } = require('../utils/organization');

class Order {
  static async findAll(limit, offset) {
    const orgMail = getOrgMail();
    // First, get the basic order information
    const [orders] = await pool.query(
      "SELECT o.*, da.Full_Name, da.Address, da.City, da.Country, c.Email " +
        "FROM `Order` o " +
        "JOIN Delivery_Address da ON o.Delivery_Address_idDelivery_Address = da.idDelivery_Address " +
        "JOIN Customer c ON da.Customer_idCustomer = c.idCustomer " +
        "WHERE o.orgmail = ? " +
        "ORDER BY o.idOrder DESC LIMIT ? OFFSET ?",
      [orgMail, limit, offset]
    )

    // If we have orders, fetch image for each order's first product
    if (orders.length > 0) {
      // Get an array of order IDs
      const orderIds = orders.map(order => order.idOrder)

      // Get product images for the first product in each order
      const [productImages] = await pool.query(
        "SELECT ohpv.Order_idOrder, MAX(p.Main_Image_Url) as product_image " +
          "FROM Order_has_Product_Variations ohpv " +
          "JOIN Product_Variations pv ON ohpv.Product_Variations_idProduct_Variations = pv.idProduct_Variations " +
          "JOIN Product p ON pv.Product_idProduct = p.idProduct " +
          "WHERE ohpv.Order_idOrder IN (?) AND ohpv.orgmail = ? " +
          "GROUP BY ohpv.Order_idOrder",
        [orderIds, orgMail]
      )

      // Create a map of order ID to product image
      const imageMap = {}
      productImages.forEach(item => {
        imageMap[item.Order_idOrder] = item.product_image
      })

      // Add the product_image field to each order
      orders.forEach(order => {
        order.product_image = imageMap[order.idOrder] || null
      })
    }

    return orders
  }

  static async findById(id) {
    const orgMail = getOrgMail();
    // Parse id to integer and validate it
    const orderId = parseInt(id, 10)

    // Check if orderId is a valid number
    if (isNaN(orderId)) {
      console.error("Invalid order ID, not a number:", id)
      return null
    }

    console.log("Finding order with ID:", orderId)

    const [orders] = await pool.query(
      "SELECT o.*, da.Full_Name, da.Address, da.City, da.Country, c.Email " +
        "FROM `Order` o " +
        "JOIN Delivery_Address da ON o.Delivery_Address_idDelivery_Address = da.idDelivery_Address " +
        "JOIN Customer c ON da.Customer_idCustomer = c.idCustomer " +
        "WHERE o.idOrder = ? AND o.orgmail = ?",
      [orderId, orgMail]
    )

    console.log("Orders found:", orders.length)

    if (orders.length === 0) {
      return null
    }

    // Get order items with product images
    const [orderItems] = await pool.query(
      "SELECT oi.*, p.idProduct as product_id, p.Description as product_name, p.Main_Image_Url as product_image, pv.Colour, pv.Size " +
        "FROM Order_has_Product_Variations oi " +
        "JOIN Product_Variations pv ON oi.Product_Variations_idProduct_Variations = pv.idProduct_Variations " +
        "JOIN Product p ON pv.Product_idProduct = p.idProduct " +
        "WHERE oi.Order_idOrder = ? AND oi.orgmail = ?",
      [orderId, orgMail]
    )

    console.log("Order items found:", orderItems.length)

    return {
      order: orders[0],
      items: orderItems,
    }
  }

  static async findByCustomerId(customerId) {
    const orgMail = getOrgMail();
    // Ensure customerId is an integer
    const customerIdInt = parseInt(customerId, 10)

    if (isNaN(customerIdInt)) {
      console.error("Invalid customer ID:", customerId)
      return []
    }

    console.log("Finding orders for customer ID:", customerIdInt)

    const [orders] = await pool.query(
      `
      SELECT o.*, da.Full_Name, da.Address, da.City, da.Country 
      FROM \`Order\` o
      JOIN Delivery_Address da ON o.Delivery_Address_idDelivery_Address = da.idDelivery_Address
      JOIN Customer c ON da.Customer_idCustomer = c.idCustomer
      WHERE c.idCustomer = ? AND o.orgmail = ?
    `,
      [customerIdInt, orgMail]
    )

    console.log("Orders found:", orders.length)
    return orders
  }

  static async create(orderData) {
    const orgMail = getOrgMail();
    const {
      delivery_address_id,
      total_amount,
      delivery_type,
      delivery_charges,
      net_amount,
      payment_type,
    } = orderData

    const [order] = await pool.query(
      "INSERT INTO `Order` (Date_Time, Delivery_Address_idDelivery_Address, Total_Amount, Delivery_Type, Delivery_Charges, Net_Amount, Payment_Type, Payment_Stats, Delivery_Status, Delivery_Date, Status, orgmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        new Date().toLocaleString(),
        delivery_address_id,
        total_amount,
        delivery_type,
        delivery_charges,
        net_amount,
        payment_type,
        "pending",
        "processing",
        new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        "active",
        orgMail
      ]
    )

    return order.insertId
  }

  static async addOrderItem(orderItem) {
    const orgMail = getOrgMail();
    const {
      order_id,
      product_variation_id,
      rate,
      qty,
      total,
      discount_percentage,
      discount_amount,
      total_amount,
    } = orderItem

    await pool.query(
      "INSERT INTO Order_has_Product_Variations (Order_idOrder, Product_Variations_idProduct_Variations, Rate, Qty, Total, Discount_Percentage, Discount_Amount, Total_Amount, orgmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        order_id,
        product_variation_id,
        rate,
        qty,
        total,
        discount_percentage || 0,
        discount_amount || 0,
        total_amount,
        orgMail
      ]
    )
  }

  static async updateStatus(id, status) {
    const orgMail = getOrgMail();
    const [result] = await pool.query(
      "UPDATE `Order` SET Status = ? WHERE idOrder = ? AND orgmail = ?",
      [status, id, orgMail]
    )

    return result.affectedRows
  }

  static async updateDeliveryDate(id, deliveryDate) {
    const orgMail = getOrgMail();
    const [result] = await pool.query(
      "UPDATE `Order` SET Delivery_Date = ? WHERE idOrder = ? AND orgmail = ?",
      [deliveryDate, id, orgMail]
    )

    return result.affectedRows
  }

  static async updatePaymentStatus(id, paymentStatus) {
    const orgMail = getOrgMail();
    const [result] = await pool.query(
      "UPDATE `Order` SET Payment_Stats = ? WHERE idOrder = ? AND orgmail = ?",
      [paymentStatus, id, orgMail]
    )

    return result.affectedRows
  }

  static async count() {
    const orgMail = getOrgMail();
    const [result] = await pool.query("SELECT COUNT(*) as count FROM `Order` WHERE orgmail = ?", [orgMail])
    return result[0].count
  }

  static async getTotalRevenue() {
    const orgMail = getOrgMail();
    const [result] = await pool.query(
      "SELECT SUM(Total_Amount) as revenue FROM `Order` WHERE orgmail = ?",
      [orgMail]
    )
    return result[0].revenue || 0
  }

  static async getRecentOrders(limit = 5) {
    const orgMail = getOrgMail();
    const [recentOrders] = await pool.query(
      "SELECT o.*, c.Full_Name as customer_name FROM `Order` o " +
        "JOIN Delivery_Address da ON o.Delivery_Address_idDelivery_Address = da.idDelivery_Address " +
        "JOIN Customer c ON da.Customer_idCustomer = c.idCustomer " +
        "WHERE o.orgmail = ? " +
        "ORDER BY o.idOrder DESC LIMIT ?",
      [orgMail, limit]
    )

    return recentOrders
  }

  static async getSalesData(days = 7) {
    const orgMail = getOrgMail();
    const [salesData] = await pool.query(
      "SELECT DATE(Date_Time) as date, SUM(Total_Amount) as sales " +
        "FROM `Order` " +
        "WHERE Date_Time >= DATE_SUB(CURDATE(), INTERVAL ? DAY) AND orgmail = ? " +
        "GROUP BY DATE(Date_Time) " +
        "ORDER BY date",
      [days, orgMail]
    )

    return salesData
  }

  static async countByStatus() {
    const orgMail = getOrgMail();
    const [result] = await pool.query(
      "SELECT Status, COUNT(*) as count FROM `Order` WHERE orgmail = ? GROUP BY Status",
      [orgMail]
    )
    return result
  }

  static async countPendingDelivery() {
    const orgMail = getOrgMail();
    const [result] = await pool.query(
      "SELECT COUNT(*) as count FROM `Order` WHERE Delivery_Status = ? AND orgmail = ?",
      ["pending", orgMail]
    )
    return result[0].count
  }
  
  static async getTotalRevenue() {
    const orgMail = getOrgMail();
    const [result] = await pool.query(
      "SELECT SUM(Net_Amount) as total_revenue FROM `Order` WHERE Payment_Stats = 'paid' AND orgmail = ?",
      [orgMail]
    )
    return result[0].total_revenue || 0
  }

  static async getMonthlyTotalRevenue() {
    const orgMail = getOrgMail();
    const [result] = await pool.query(
      "SELECT DATE_FORMAT(Date_Time, '%Y-%m') AS month, SUM(Net_Amount) AS monthly_revenue " +
        "FROM `Order` " +
        "WHERE Payment_Stats = 'paid' AND orgmail = ? " +
        "GROUP BY month " +
        "ORDER BY month DESC",
      [orgMail]
    )
    return result
  }
}

module.exports = Order
