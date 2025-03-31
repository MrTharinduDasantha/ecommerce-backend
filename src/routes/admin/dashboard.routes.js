const express = require('express');
const dashboardController = require('../../controllers/admin/dashboard.controller');

const router = express.Router();

// Admin Dashboard Routes
router.get('/stats', dashboardController.getStats);

module.exports = router; 