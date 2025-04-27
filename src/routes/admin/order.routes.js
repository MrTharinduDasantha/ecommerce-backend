const express = require("express");
const orderController = require("../../controllers/admin/order.controller");
const authenticateToken = require("../../middleware/authMiddleware");

const router = express.Router();

// Apply authentication middleware to all order routes
router.use(authenticateToken);

// Admin Order Routes
router.get("/", orderController.getAllOrders.bind(orderController));
router.get(
  "/status/count",
  orderController.getOrderCountByStatus.bind(orderController)
);
router.get("/:id", orderController.getOrderById.bind(orderController));
router.put(
  "/:id/status",
  orderController.updateOrderStatus.bind(orderController)
);
router.get(
  "/delivery/pending/count",
  orderController.getPendingDeliveryCount.bind(orderController)
);
router.put(
  "/:id/payment-status",
  orderController.updatePaymentStatus.bind(orderController)
);

module.exports = router;
