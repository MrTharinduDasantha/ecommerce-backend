const Customer = require('../../models/customer.model');
const bcrypt = require('bcryptjs');

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

module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
