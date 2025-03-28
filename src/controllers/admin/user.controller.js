const User = require("../../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Importing JWT
const sendConfirmationEmail = require("../../utils/mailer");
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
    console.log("Fetching user with ID:", req.params.id); // Log the ID
    const user = await User.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Add a new user
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

    res.status(201).json({ id: userId, message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { full_name, email, phone_no, status } = req.body;

    // Validate email format if necessary
    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Update user in the database
    await User.updateUser(req.params.id, full_name, email, phone_no, status);

    // Send confirmation email after the update
    sendConfirmationEmail(email); // Send email confirmation

    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return re.test(email);
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

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received login attempt for:", email); // Add logging for email

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide both email and password." });
    }

    // Fetch user by email
    const user = await User.getUserByEmail(email);
    console.log("User fetched from DB:", user); // Log user from DB

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.idUser }, "your-secret-key", {
      expiresIn: "1h",
    });

    // Send the response with the token
    res.json({
      message: "Login successful",
      userId: user.idUser,
      fullName: user.Full_Name,
      email: user.Email,
      phoneNo: user.Phone_No,
      status: user.Status,
      token: token,
    });
  } catch (error) {
    console.error("Error during login:", error); // Log any unexpected errors
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProfile = async (req, res) => {
  try {
    console.log("User info from JWT:", req.user); // This should print user info like { userId: 2 }
    const user = await User.getUserById(req.user.userId); // Fetch user based on decoded userId
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error); // Log the error
    res.status(500).json({ error: "Database error" });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { full_name, email, phone_no, status } = req.body;
    const userId = req.user.userId; // Extract userId from JWT payload

    // Validate the input data
    if (!full_name || !email || !phone_no) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Update user profile in database
    await User.updateUser(userId, full_name, email, phone_no, status);

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  loginUser,
  deleteUser,
  getProfile,
  updateProfile,
};
