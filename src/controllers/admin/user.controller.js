const User = require("../../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Importing JWT
const sendConfirmationEmail = require("../../utils/mailer");
const pool = require("../../config/database");

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

    // Log admin action with user details
    const newUserInfo = { full_name, email, phone_no }; // Construct the new user info as an object
    await logAdminAction(req.user.userId, "Added new user", req.headers['user-agent'], JSON.stringify(newUserInfo));

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

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.params.id;

    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const query = "UPDATE User SET status = ? WHERE idUser = ?";
    const values = [status, userId];
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating status" });
  }
};
// Update user password
const updateUserPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
    await pool.query("UPDATE User SET Password = ? WHERE idUser = ?", [
      hashedPassword,
      id,
    ]);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Error updating password" });
  }
};
const logAdminAction = async (adminId, action, deviceInfo, newUserInfo = null) => {
  console.log("Logging action", { adminId, action, deviceInfo, newUserInfo }); // Add this line
  const query = "INSERT INTO admin_logs (admin_id, action, device_info, new_user_info) VALUES (?, ?, ?, ?)";
  await pool.query(query, [adminId, action, deviceInfo, newUserInfo]);
};
const getAdminLogs = async (req, res) => {
  try {
      const [logs] = await pool.query(
          `
          SELECT admin_logs.*, User.Full_Name AS Admin_Name,
          admin_logs.new_user_info AS User_Details
          FROM admin_logs
          JOIN User ON admin_logs.admin_id = User.idUser
          ORDER BY timestamp DESC
          `
      );
      console.log("Admin Logs:", logs); // Log what you retrieve from the database
      res.json(logs);
  } catch (error) {
      console.error("Error fetching admin logs:", error);
      res.status(500).json({ error: "Database error" });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.getUserByEmail(email);
      if (!user) return res.status(404).json({ error: "User not found" });

      const isMatch = await bcrypt.compare(password, user.Password);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign({ userId: user.idUser }, "your-secret-key", {
          expiresIn: "1d",
      });

      // Log the login action
      await logAdminAction(user.idUser, "Logged In", req.headers['user-agent']);

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
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout function (optional, if you support logout)
const logoutAdmin = async (adminId) => {
  await logAdminAction(adminId, "Logged Out", "Logout");
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  loginUser,
  deleteUser,
  getProfile,
  updateUserStatus,
  updateUserPassword,
  logoutAdmin,
  getAdminLogs
};