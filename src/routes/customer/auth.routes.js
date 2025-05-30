const express = require("express");
const authController = require("../../controllers/customer/auth.controller");
const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();

// Customer Authentication Routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/request-password-reset", authController.requestPasswordReset);
router.post("/verify-otp", authController.verifyOTP);
router.post("/reset-password", authController.resetPassword);
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
