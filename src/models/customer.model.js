const pool = require('../config/database'); // Import MySQL connection pool
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

// Get all customers
const getAllCustomers = async () => {
  const [rows] = await pool.query('SELECT idCustomer, Full_Name, Email, Mobile_No, Address, City, Country, Status, created_at, updated_at FROM Customer');
  return rows;
};

// Get customer by ID
const getCustomerById = async (id) => {
  const [rows] = await pool.query('SELECT idCustomer, Full_Name, Birthday, Email, Mobile_No, Address, City, Country, Status FROM Customer WHERE idCustomer = ?', [id]);
  return rows[0];
};

// Add a new customer
const addCustomer = async (first_name, full_name, address, city, country, mobile_no, status, email, password) => {
  const [result] = await pool.query(
    'INSERT INTO Customer (First_Name, Full_Name, Address, City, Country, Mobile_No, Status, Email, Password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [first_name, full_name, address, city, country, mobile_no, status, email, password]
  );
  return result.insertId; // Returning the ID after inserting
};

// Update customer
const updateCustomer = async (id, customerData) => {
  const updates = [];
  const values = [];

  if (customerData.first_name !== undefined) {
      updates.push('First_Name = ?');
      values.push(customerData.first_name);
  }

  if (customerData.full_name !== undefined) {
      updates.push('Full_Name = ?');
      values.push(customerData.full_name);
  }

  if (customerData.birthday !== undefined) {
    updates.push('Birthday = ?')
    values.push(customerData.birthday)
  }

  if (customerData.address !== undefined) {
      updates.push('Address = ?');
      values.push(customerData.address);
  }

  if (customerData.city !== undefined) {
      updates.push('City = ?');
      values.push(customerData.city);
  }

  if (customerData.country !== undefined) {
      updates.push('Country = ?');
      values.push(customerData.country);
  }

  if (customerData.mobile_no !== undefined) {
      updates.push('Mobile_No = ?');
      values.push(customerData.mobile_no);
  }

  if (customerData.status !== undefined) {
      updates.push('Status = ?');
      values.push(customerData.status);
  }

  if (customerData.email !== undefined) {
      updates.push('Email = ?');
      values.push(customerData.email);
  }

  if (customerData.password !== undefined) {
      const hashedPassword = await bcrypt.hash(customerData.password, 10);
      updates.push('Password = ?');
      values.push(hashedPassword);
  }

  if (updates.length === 0) {
      return; // If there are no fields to update
  }

  const query = `UPDATE Customer SET ${updates.join(', ')} WHERE idCustomer = ?`;
  values.push(id);
  await pool.query(query, values);
};

// Delete customer
const deleteCustomer = async (id) => {
  await pool.query('DELETE FROM Customer WHERE idCustomer = ?', [id]);
};

// Get customer by email
const getCustomerByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM Customer WHERE Email = ?', [email]);
  return rows[0]; // Return the customer record
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  getCustomerByEmail,
  deleteCustomer
};
