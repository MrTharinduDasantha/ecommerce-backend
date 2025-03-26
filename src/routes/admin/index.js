const express = require('express');
const authRoutes = require('./user.routes');
const dashboardRoutes = require('./dashboard.routes');
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');
const userRoutes = require('./customer.routes');

const router = express.Router();

// Admin routes
// In your routes/index.js or wherever your routes are being set up

 
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);

module.exports = router; 