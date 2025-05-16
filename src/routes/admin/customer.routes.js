const express = require("express");
const customerController = require("../../controllers/admin/customer.controller");
const authenticateToken = require("../../middleware/authMiddleware");

const router = express.Router();

// Apply authentication middleware to all customer routes

// Admin Customer Routes
router.get("/", authenticateToken, customerController.getCustomers);
router.get("/count", customerController.getCustomerCount);
router.get("/:id", authenticateToken, customerController.getCustomer);
router.post("/", authenticateToken, customerController.createCustomer);
router.put("/:id", authenticateToken, customerController.updateCustomer);
router.delete("/:id", authenticateToken, customerController.deleteCustomer);
router.get(
  "/:id/history",
  authenticateToken,
  customerController.getCustomerHistory
);

module.exports = router;
