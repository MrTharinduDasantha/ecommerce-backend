const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const userRoutes = require("./routes/admin/user.routes");
const adminCustomerRoutes = require("./routes/admin/customer.routes");
const productRoutes = require("./routes/admin/product.routes");
const settingRoutes = require("./routes/admin/setting.routes");
const cartRoutes = require("./routes/customer/cart.routes");
const orderRoutes = require("./routes/admin/order.routes");
const customerOrderRoutes = require("./routes/customer/order.routes");
const adminRoutes = require("./routes/admin/user.routes");
const notificationRoutes = require("./routes/admin/notification.routes");
const customerAuthRoutes = require("./routes/customer/auth.routes");
const customerAddressRoutes = require("./routes/customer/address.routes");

require("dotenv").config(); // Load environment variables from .env file

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend url
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use("/src/uploads", express.static("src/uploads"));

// Public routes - no authentication needed
app.use("/api/auth/customers", customerAuthRoutes);

// Protected routes
app.use("/api/admin/customers", adminCustomerRoutes); // Use the admin customer routes
app.use("/api/users", userRoutes); // Use the user routes
app.use("/api/products", productRoutes); // Use the product routes
app.use("/api/settings", settingRoutes); // Use the setting routes
app.use("/api/carts", cartRoutes); // Use the cart routes
app.use("/api/orders", customerOrderRoutes); // Use the customer order routes
app.use("/api/customers", customerAddressRoutes); // Use the customer address routes
app.use("/admin/orders", orderRoutes); // Use the admin order routes
app.use("/admin/notifications", notificationRoutes); // Use the notification routes
app.use("/api/admin/users", adminRoutes); // Use the admin user routes

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.set("io", io);

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
