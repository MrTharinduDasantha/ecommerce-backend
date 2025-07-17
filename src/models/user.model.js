const pool = require("../config/database");
const { getOrgMail } = require('../utils/organization');

// Get all users
const getAllUsers = async () => {
  const orgMail = getOrgMail();
  const [rows] = await pool.query(
    "SELECT idUser, Full_Name, Email, Password, Phone_No, Status, created_at, updated_at FROM User WHERE orgmail = ?",
    [orgMail]
  );
  return rows;
};

// Get user by ID
const getUserById = async (id) => {
  const orgMail = getOrgMail();
  const [rows] = await pool.query("SELECT * FROM User WHERE idUser = ? AND orgmail = ?", [id, orgMail]);
  return rows[0];
};

// Create a new user
const createUser = async (full_name, email, password, phone_no, status) => {
  const orgMail = getOrgMail();
  const [result] = await pool.query(
    "INSERT INTO User (Full_Name, Email, Password, Phone_No, Status, orgmail) VALUES (?, ?, ?, ?, ?, ?)",
    [full_name, email, password, phone_no, status, orgMail]
  );
  return result.insertId;
};

// Update user in database
const updateUser = async (id, full_name, email, phone_no, status) => {
  const orgMail = getOrgMail();
  await pool.query(
    "UPDATE User SET Full_Name = ?, Email = ?, Phone_No = ?, Status = ? WHERE idUser = ? AND orgmail = ?",
    [full_name, email, phone_no, status, id, orgMail]
  );
};

// Get user by email
const getUserByEmail = async (email) => {
  const orgMail = getOrgMail();
  const [rows] = await pool.query("SELECT * FROM User WHERE Email = ? AND orgmail = ?", [
    email, orgMail
  ]);
  return rows[0];
};

// Delete user
const deleteUser = async (id) => {
  const orgMail = getOrgMail();
  await pool.query("DELETE FROM User WHERE idUser = ? AND orgmail = ?", [id, orgMail]);
};

// Store OTP for user
const storeOTP = async (email, otp) => {
  const orgMail = getOrgMail();
  await pool.query("UPDATE User SET OTP = ? WHERE Email = ? AND orgmail = ?", [otp, email, orgMail]);
};

// Verify OTP
const verifyOTP = async (email, otp) => {
  const orgMail = getOrgMail();
  const [rows] = await pool.query(
    "SELECT * FROM User WHERE Email = ? AND OTP = ? AND orgmail = ?",
    [email, otp, orgMail]
  );
  return rows[0];
};

// Clear OTP
const clearOTP = async (email) => {
  const orgMail = getOrgMail();
  await pool.query("UPDATE User SET OTP = NULL WHERE Email = ? AND orgmail = ?", [email, orgMail]);
};

// Update password
const updatePassword = async (email, password) => {
  const orgMail = getOrgMail();
  await pool.query("UPDATE User SET Password = ? WHERE Email = ? AND orgmail = ?", [
    password,
    email,
    orgMail
  ]);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  getUserByEmail,
  deleteUser,
  storeOTP,
  verifyOTP,
  clearOTP,
  updatePassword,
};
