const pool = require("../config/database");

class Order {
  static async findAll(limit, offset) {
    // First, get the basic order information
    const [orders] = await pool.query(
      "SELECT o.*, da.Full_Name, da.Address, da.City, da.Country, c.Email " +
        "FROM `Order` o " +
        "JOIN Delivery_Address da ON o.Delivery_Address_idDelivery_Address = da.idDelivery_Address " +
        "JOIN Customer c ON da.Customer_idCustomer = c.idCustomer " +
        "ORDER BY o.idOrder DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    // If we have orders, fetch image for each order's first product
    if (orders.length > 0) {
      // Get an array of order IDs
      const orderIds = orders.map((order) => order.idOrder);

      // Get product images for the first product in each order
      const [productImages] = await pool.query(
        "SELECT ohpv.Order_idOrder, MAX(p.Main_Image_Url) as product_image " +
          "FROM Order_has_Product_Variations ohpv " +
          "JOIN Product_Variations pv ON ohpv.Product_Variations_idProduct_Variations = pv.idProduct_Variations " +
          "JOIN Product p ON pv.Product_idProduct = p.idProduct " +
          "WHERE ohpv.Order_idOrder IN (?) " +
          "GROUP BY ohpv.Order_idOrder",
        [orderIds]
      );

      // Create a map of order ID to product image
      const imageMap = {};
      productImages.forEach((item) => {
        imageMap[item.Order_idOrder] = item.product_image;
      });

      // Add the product_image field to each order
      orders.forEach((order) => {
        order.product_image = imageMap[order.idOrder] || null;
      });
    }

    return orders;
  }

  static async findById(id) {
    // Parse id to integer and validate it
    const orderId = parseInt(id, 10);

    // Check if orderId is a valid number
    if (isNaN(orderId)) {
      console.error("Invalid order ID, not a number:", id);
      return null;
    }

    console.log("Finding order with ID:", orderId);

    const [orders] = await pool.query(
      "SELECT o.*, da.Full_Name, da.Address, da.City, da.Country, c.Email " +
        "FROM `Order` o " +
        "JOIN Delivery_Address da ON o.Delivery_Address_idDelivery_Address = da.idDelivery_Address " +
        "JOIN Customer c ON da.Customer_idCustomer = c.idCustomer " +
        "WHERE o.idOrder = ?",
      [orderId]
    );

    console.log("Orders found:", orders.length);

    if (orders.length === 0) {
      return null;
    }

    // Get order items with product images
    const [orderItems] = await pool.query(
      "SELECT oi.*, p.Description as product_name, p.Main_Image_Url as product_image, pv.Colour, pv.Size " +
        "FROM Order_has_Product_Variations oi " +
        "JOIN Product_Variations pv ON oi.Product_Variations_idProduct_Variations = pv.idProduct_Variations " +
        "JOIN Product p ON pv.Product_idProduct = p.idProduct " +
        "WHERE oi.Order_idOrder = ?",
      [orderId]
    );

    return {
      order: orders[0],
      items: orderItems,
    };
  }

  static async findByCustomerId(customerId) {
    const [orders] = await pool.query(
      `
      SELECT o.*, da.Full_Name, da.Address, da.City, da.Country 
      FROM \`Order\` o
      JOIN Delivery_Address da ON o.Delivery_Address_idDelivery_Address = da.idDelivery_Address
      JOIN Customer c ON da.Customer_idCustomer = c.idCustomer
      WHERE c.idCustomer = ?
    `,
      [customerId]
    );

    return orders;
  }

  static async create(orderData) {
    const {
      delivery_address_id,
      total_amount,
      delivery_type,
      delivery_charges,
      net_amount,
      payment_type,
    } = orderData;

    const [order] = await pool.query(
      "INSERT INTO `Order` (Date_Time, Delivery_Address_idDelivery_Address, Total_Amount, Delivery_Type, Delivery_Charges, Net_Amount, Payment_Type, Payment_Stats, Delivery_Status, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        new Date().toISOString(),
        delivery_address_id,
        total_amount,
        delivery_type,
        delivery_charges,
        net_amount,
        payment_type,
        "pending",
        "processing",
        "active",
      ]
    );

    return order.insertId;
  }

  static async addOrderItem(orderItem) {
    const {
      order_id,
      product_variation_id,
      rate,
      qty,
      total,
      discount_percentage,
      discount_amount,
      total_amount,
    } = orderItem;

    await pool.query(
      "INSERT INTO Order_has_Product_Variations (Order_idOrder, Product_Variations_idProduct_Variations, Rate, Qty, Total, Discount_Percentage, Discount_Amount, Total_Amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        order_id,
        product_variation_id,
        rate,
        qty,
        total,
        discount_percentage || 0,
        discount_amount || 0,
        total_amount,
      ]
    );
  }

  static async updateStatus(id, status) {
    const [result] = await pool.query(
      "UPDATE `Order` SET Status = ? WHERE idOrder = ?",
      [status, id]
    );

    return result.affectedRows;
  }

  static async updateDeliveryDate(id, deliveryDate) {
    const [result] = await pool.query(
      "UPDATE `Order` SET Delivery_Date = ? WHERE idOrder = ?",
      [deliveryDate, id]
    );

    return result.affectedRows;
  }

  static async updatePaymentStatus(id, paymentStatus) {
    const [result] = await pool.query(
      "UPDATE `Order` SET Payment_Stats = ? WHERE idOrder = ?",
      [paymentStatus, id]
    );

    return result.affectedRows;
  }

  static async count() {
    const [result] = await pool.query("SELECT COUNT(*) as count FROM `Order`");
    return result[0].count;
  }

  static async getTotalRevenue() {
    const [result] = await pool.query(
      "SELECT SUM(Total_Amount) as revenue FROM `Order`"
    );
    return result[0].revenue || 0;
  }

  static async getRecentOrders(limit = 5) {
    const [recentOrders] = await pool.query(
      "SELECT o.*, c.Full_Name as customer_name FROM `Order` o " +
        "JOIN Delivery_Address da ON o.Delivery_Address_idDelivery_Address = da.idDelivery_Address " +
        "JOIN Customer c ON da.Customer_idCustomer = c.idCustomer " +
        "ORDER BY o.idOrder DESC LIMIT ?",
      [limit]
    );

    return recentOrders;
  }

  static async getSalesData(days = 7) {
    const [salesData] = await pool.query(
      "SELECT DATE(Date_Time) as date, SUM(Total_Amount) as sales " +
        "FROM `Order` " +
        "WHERE Date_Time >= DATE_SUB(CURDATE(), INTERVAL ? DAY) " +
        "GROUP BY DATE(Date_Time) " +
        "ORDER BY date",
      [days]
    );

    return salesData;
  }

  static async countByStatus() {
    const [result] = await pool.query(
      "SELECT Status, COUNT(*) as count FROM `Order` GROUP BY Status"
    );
    return result;
  }

  static async countPendingDelivery() {
    const [result] = await pool.query(
      "SELECT COUNT(*) as count FROM `Order` WHERE Delivery_Status = ?",
      ["pending"]
    );
    return result[0].count;
  }
  static async getTotalRevenue() {
    const [result] = await pool.query(
      "SELECT SUM(Net_Amount) as total_revenue FROM `Order` WHERE Payment_Stats = 'paid'"
    );
    return result[0].total_revenue || 0; // Ensure we handle null values
  }

  static async getMonthlyTotalRevenue() {
    const [result] = await pool.query(
      "SELECT DATE_FORMAT(Date_Time, '%Y-%m') AS month, SUM(Net_Amount) AS monthly_revenue " +
      "FROM `Order` " +
      "WHERE Payment_Stats = 'paid' " +
      "GROUP BY month " +
      "ORDER BY month DESC"
    );
    return result; // This will return an array of monthly revenue objects
  }
}

module.exports = Order;
