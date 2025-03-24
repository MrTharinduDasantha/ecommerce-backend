const express = require('express');
const authController = require('../../controllers/admin/auth.controller');

const router = express.Router();

// Admin Authentication Routes
router.post('/login', authController.login);

module.exports = router; 