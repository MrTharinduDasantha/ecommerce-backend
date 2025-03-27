const pool = require('../config/database'); // Import MySQL connection pool

// Get all users
const getAllUsers = async () => {
  const [rows] = await pool.query('SELECT idUser,Full_Name, Email, Password, Phone_No, Status,created_at, updated_at FROM users');
  return rows;
};

// Get user by ID
const getUserById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE idUser = ?', [id]);
  return rows[0];
};

// Add user
const addUser = async (full_name, email, password, phone_no, status) => {
  const [result] = await pool.query(
    'INSERT INTO users (Full_Name, Email, Password, Phone_No, Status) VALUES (?, ?, ?, ?, ?)',
    [full_name, email, password, phone_no, status]
  );
  return result.insertId; // Returning the ID after inserting
};
// Update user
const updateUser = async (id, full_name, email, phone_no, status) => {
  await pool.query(
    'UPDATE users SET Full_Name = ?, Email = ?, Phone_No = ?, Status = ? WHERE idUser = ?',
    [full_name, email, phone_no, status, id]
  );
};

// Delete user
const deleteUser = async (id) => {
  await pool.query('DELETE FROM users WHERE idUser = ?', [id]);
};

// Get user by email
const getUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE Email = ?', [email]);
  return rows[0]; // Return the user record
};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  getUserByEmail,
  deleteUser
};
