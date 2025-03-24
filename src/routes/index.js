const express = require('express');
const adminRoutes = require('./admin');
const customerRoutes = require('./customer');

const router = express.Router();

// Main API Routes
router.use('/admin', adminRoutes);
router.use('/api', customerRoutes); // Customer-facing APIs use /api prefix

// Test DB Connection
router.get('/test', async (req, res) => {
  try {
    const [rows] = await require('../config/database').query('SELECT 1');
    res.json({ message: 'Database connected successfully', data: rows });
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

module.exports = router; 