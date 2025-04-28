const pool = require("../config/database"); // Import MySQL connection pool

// Get all users
const getAllUsers = async () => {
  const [rows] = await pool.query(
    "SELECT idUser, Full_Name, Email, Password, Phone_No, Status, created_at, updated_at FROM User"
  );
  return rows;
};

// Get user by ID
const getUserById = async (id) => {
  console.log("Fetching user with ID:", id); // Log the ID being queried
  const [rows] = await pool.query("SELECT * FROM User WHERE idUser = ?", [id]);
  console.log("User found in DB:", rows); // Log the result from the database
  return rows[0]; // Return the first row if found
};

// Add user to database
const addUser = async (full_name, email, password, phone_no, status) => {
  const [result] = await pool.query(
    "INSERT INTO User (Full_Name, Email, Password, Phone_No, Status) VALUES (?, ?, ?, ?, ?)",
    [full_name, email, password, phone_no, status]
  );
  return result.insertId; // Returning the ID after inserting
};

// Update user in database
const updateUser = async (id, full_name, email, phone_no, status) => {
  await pool.query(
    "UPDATE User SET Full_Name = ?, Email = ?, Phone_No = ?, Status = ? WHERE idUser = ?",
    [full_name, email, phone_no, status, id]
  );
};

// Get user by email
const getUserByEmail = async (email) => {
  console.log("Attempting to fetch user with email:", email); // Log the email being searched
  const [rows] = await pool.query("SELECT * FROM User WHERE Email = ?", [
    email,
  ]);
  console.log("Fetched user from DB:", rows); // Log the result from the query
  return rows[0]; // Return the user record
};

// Delete user
const deleteUser = async (id) => {
  await pool.query("DELETE FROM User WHERE idUser = ?", [id]);
};

// Save OTP for password reset
const saveOtp = async (email, otp) => {
  await pool.query("UPDATE User SET OTP = ? WHERE Email = ?", [otp, email]);
};

// Verify OTP for password reset
const verifyOtp = async (email, otp) => {
  const [rows] = await pool.query(
    "SELECT * FROM User WHERE Email = ? AND OTP = ?",
    [email, otp]
  );
  return rows[0];
};

// Clear OTP after verification
const clearOtp = async (email) => {
  await pool.query("UPDATE User SET OTP = NULL WHERE Email = ?", [email]);
};

// Update password
const updatePassword = async (email, password) => {
  await pool.query("UPDATE User SET Password = ? WHERE Email = ?", [
    password,
    email,
  ]);
};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  getUserByEmail,
  deleteUser,
  saveOtp,
  verifyOtp,
  clearOtp,
  updatePassword,
};
