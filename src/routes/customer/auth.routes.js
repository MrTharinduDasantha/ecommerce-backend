const express = require('express');
const authController = require('../../controllers/customer/auth.controller');

const router = express.Router();

// Customer Authentication Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router; 