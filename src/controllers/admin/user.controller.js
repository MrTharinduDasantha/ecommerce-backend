const User = require("../../models/user.model");
const bcrypt = require("bcryptjs");

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Get a single user
const getUser = async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Add a new user
// In the createUser controller, send the response:
const createUser = async (req, res) => {
  try {
    const { full_name, email, password, phone_no, status } = req.body;

    if (!full_name || !email || !password || !phone_no) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.addUser(
      full_name,
      email,
      hashedPassword,
      phone_no,
      status || "Active"
    );

    // Send response with the new user's ID
    res.status(201).json({ id: userId, message: "User added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { full_name, email, phone_no, status } = req.body;
    await User.updateUser(req.params.id, full_name, email, phone_no, status);
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update error:", error); // More specific error message
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    await User.deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide both email and password." });
    }

    // Fetch user by email
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Respond with a success message and user data
    res.json({
      message: "Login successful",
      userId: user.idUser,
      fullName: user.Full_Name,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  loginUser,
  deleteUser,
};
