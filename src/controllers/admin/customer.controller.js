const Customer = require('../../models/customer.model');
const bcrypt = require('bcryptjs');
const pool = require('../../config/database');

// Get all customers
const getCustomers = async (req, res) => {
  try {
      const customers = await Customer.getAllCustomers();
      res.json(customers);
  } catch (error) {
      res.status(500).json({ error: 'Database error' });
  }
};

// Get a single customer
const getCustomer = async (req, res) => {
  try {
      const customer = await Customer.getCustomerById(req.params.id);
      if (!customer) return res.status(404).json({ error: 'Customer not found' });
      res.json(customer);
  } catch (error) {
      res.status(500).json({ error: 'Database error' });
  }
};

// Add a new customer
const createCustomer = async (req, res) => {
  try {
    const { first_name, full_name, address, city, country, mobile_no, status, email, password } = req.body;

    if (!first_name || !full_name || !address || !city || !country || !mobile_no || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const customerId = await Customer.addCustomer(first_name, full_name, address, city, country, mobile_no, status || 'Active', email, hashedPassword);

    res.status(201).json({ id: customerId, message: 'Customer added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Update customer
const updateCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customerData = req.body;

    // Get the original customer data for logging
    const originalCustomer = await Customer.getCustomerById(customerId);
    if (!originalCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Update the customer
    await Customer.updateCustomer(customerId, customerData);

    // Prepare logging data
    const logData = {
      customerId: customerId,
      originalData: {
        name: originalCustomer.Full_Name,
        email: originalCustomer.Email,
        status: originalCustomer.Status,
        mobile_no: originalCustomer.Mobile_No,
      },
      updatedData: {
        name: customerData.full_name || originalCustomer.Full_Name,
        email: customerData.email || originalCustomer.Email,
        status: customerData.status || originalCustomer.Status,
        mobile_no: customerData.mobile_no || originalCustomer.Mobile_No,
      },
    };

    // Log the admin action
    const insertQuery = `
      INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) 
      VALUES (?, ?, ?, ?)
    `;
    await pool.query(insertQuery, [
      req.user.userId,
      "Updated customer",
      req.headers["user-agent"],
      JSON.stringify(logData),
    ]);

    // Emit Socket.IO event for customer update
    const io = req.app.get("io");
    io.emit("customerUpdated", {
      idCustomer: customerId,
      Full_Name: customerData.full_name || originalCustomer.Full_Name,
      Email: customerData.email || originalCustomer.Email,
      Mobile_No: customerData.mobile_no || originalCustomer.Mobile_No,
      Status: customerData.status || originalCustomer.Status,
      created_at: originalCustomer.created_at,
      updated_at: new Date(),
    });

    res.json({ message: "Customer updated successfully" });
  } catch (error) {
    console.error("Error in updateCustomer:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

// Delete customer
const deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;

    // Get customer details before deletion for logging
    const customer = await Customer.getCustomerById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Prepare logging data
    const logData = {
      customerId: customerId,
      customerName: customer.Full_Name,
      customerEmail: customer.Email
    };

    // Log the admin action first
    const insertQuery = `
      INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) 
      VALUES (?, ?, ?, ?)
    `;

    await pool.query(insertQuery, [
      req.user.userId,
      'Deleted customer',
      req.headers['user-agent'],
      JSON.stringify(logData)
    ]);

    // Then delete the customer
    await Customer.deleteCustomer(customerId);

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCustomer:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};

// Get customer history
const getCustomerHistory = async (req, res) => {
  try {
    const customerId = req.params.id;

    // First get the delivery addresses for this customer
    const [deliveryAddresses] = await pool.query(
      'SELECT * FROM Delivery_Address WHERE Customer_idCustomer = ?',
      [customerId]
    );

    // Then get the orders using the delivery addresses
    const [orders] = await pool.query(
      `SELECT o.* 
       FROM \`Order\` o
       INNER JOIN Delivery_Address da ON o.Delivery_Address_idDelivery_Address = da.idDelivery_Address
       WHERE da.Customer_idCustomer = ?`,
      [customerId]
    );

    res.json({ 
      orders, 
      deliveryAddresses 
    });
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};

const getCustomerCount = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM Customer');
    res.json({ total: rows[0].total }); // Return total count
  } catch (error) {
    console.error('Error fetching customer count:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};
module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerHistory,
  getCustomerCount
};