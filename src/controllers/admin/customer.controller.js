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
    const { first_name, full_name, address, city, country, mobile_no, status, email, password } = req.body;
    await Customer.updateCustomer(req.params.id, first_name, full_name, address, city, country, mobile_no, status, email, password);
    res.json({ message: 'Customer updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Delete customer
const deleteCustomer = async (req, res) => {
  try {
    await Customer.deleteCustomer(req.params.id);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Get customer history
const getCustomerHistory = async (req, res) => {
  try {
    const customerId = req.params.id;
    console.log('Fetching history for customer ID:', customerId); // Debugging the customer ID

    // Fetch orders related to the customer
    const [orders] = await pool.query(
      'SELECT * FROM `Order` WHERE Delivery_Address_idDelivery_Address IN (SELECT idDelivery_Address FROM Delivery_Address WHERE Customer_idCustomer = ?)',
      [customerId]
    );
    console.log('Orders:', orders); // Debugging the result of orders query

    // Fetch delivery addresses for the customer
    const [deliveryAddresses] = await pool.query(
      'SELECT * FROM Delivery_Address WHERE Customer_idCustomer = ?',
      [customerId]
    );
    console.log('Delivery Addresses:', deliveryAddresses); // Debugging the result of deliveryAddresses query

    res.json({ orders, deliveryAddresses });
  } catch (error) {
    console.error('Database query error:', error.message); // Log the error message
    res.status(500).json({ error: 'Database error', details: error.message });
  }
};

module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerHistory
};