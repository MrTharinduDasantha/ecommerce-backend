const pool = require('../config/database'); // Import MySQL connection pool

// Get all customers
const getAllCustomers = async () => {
  const [rows] = await pool.query('SELECT idCustomer, Full_Name, Email, Mobile_No, Status, created_at, updated_at FROM Customer');
  return rows;
};


// Get customer by ID
const getCustomerById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM Customer WHERE idCustomer = ?', [id]);
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
const updateCustomer = async (id, first_name, full_name, address, city, country, mobile_no, status, email, password) => {
  await pool.query(
    'UPDATE Customer SET First_Name = ?, Full_Name = ?, Address = ?, City = ?, Country = ?, Mobile_No = ?, Status = ?, Email = ?, Password = ? WHERE idCustomer = ?',
    [first_name, full_name, address, city, country, mobile_no, status, email, password, id]
  );
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
