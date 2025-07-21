// src/server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const userRoutes = require("./routes/admin/user.routes");
const adminCustomerRoutes = require("./routes/admin/customer.routes");
const productRoutes = require("./routes/admin/product.routes");
const eventRoutes = require("./routes/admin/event.routes");
const settingRoutes = require("./routes/admin/setting.routes");
const cartRoutes = require("./routes/customer/cart.routes");
const orderRoutes = require("./routes/admin/order.routes");
const customerOrderRoutes = require("./routes/customer/order.routes");
const adminRoutes = require("./routes/admin/user.routes");
const notificationRoutes = require("./routes/admin/notification.routes");
const customerAuthRoutes = require("./routes/customer/auth.routes");
const customerAddressRoutes = require("./routes/customer/address.routes");
const customerReviewRoutes = require("./routes/customer/review.routes");
const adminReviewRoutes = require('./routes/admin/review.routes');
const adminAuthRoutes = require("./routes/admin/organizations.routes"); // Updated path
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

require("dotenv").config(); // Load environment variables from .env file

const app = express();
// Middleware
app.use(bodyParser.json({ limit: '25mb' })); // handle large base64 files
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
  ],
  credentials: true,
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use("/src/uploads", express.static("src/uploads"));

// Public routes - no authentication needed
app.use("/api/auth/customers", customerAuthRoutes);

// Protected routes
app.use("/api/admin/customers", adminCustomerRoutes);
app.use("/api/admin/users", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", customerOrderRoutes);
app.use("/api/customer-addresses", customerAddressRoutes);
app.use("/api/customers", adminCustomerRoutes);
app.use("/admin/orders", orderRoutes);
app.use("/admin/notifications", notificationRoutes);
app.use("/api/reviews", customerReviewRoutes);
app.use("/api/admin/reviews", adminReviewRoutes);
app.use("/admin/auth", adminAuthRoutes);

// Socket.io connection
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.set("io", io);

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "rashelgunarathne63@gmail.com",
    pass: process.env.EMAIL_PASS || "gkhq qmhz wgyf fdgc",
  },
});

// Email route
app.post("/api/orders/:customerId/:orderId/send-invoice", async (req, res) => {
  const { emailAddress, pdfBase64 } = req.body;
  const { customerId, orderId } = req.params;

  if (!emailAddress || !pdfBase64) {
    return res.status(400).json({ message: "Missing email or PDF data." });
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || "rashelgunarathne63@gmail.com",
      to: emailAddress,
      subject: `Invoice for Order #${orderId}`,
      text: `Hi,\n\nPlease find attached the invoice for Order #${orderId}.\n\nRegards,\nAsipiya Team`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Invoice sent successfully!" });
  } catch (error) {
    console.error("Error sending invoice:", error);
    res.status(500).json({ message: "Failed to send invoice." });
  }
});

const PORT = process.env.PORT || 9000;

// Function to start the server
const startServer = (port) => {
  server
    .listen(port, async () => {
      console.log(`Server running on port ${port}`);
      // Sync all models
      try {
        await require('./models/organizations.model').sequelize.sync({ alter: true });
        console.log('Database synchronized');
      } catch (error) {
        console.error('Database synchronization error:', error);
      }
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${port} is busy, trying ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error("Server error:", err);
      }
    });
};

// Start the server
startServer(PORT);