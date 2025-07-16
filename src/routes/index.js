const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const adminRoutes = require('./admin');
const customerRoutes = require('./customer');
const { getOrgMail } = require('../utils/organization');

const router = express.Router();



// Main API Routes
router.use('/admin', adminRoutes);
router.use('/api', customerRoutes); // Customer-facing APIs use /api prefix

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const orgMail = getOrgMail();
    const [rows] = await require('../config/database').query('SELECT 1');
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      organization: orgMail
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router; 