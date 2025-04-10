const express = require('express');
const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const cartRoutes = require('./cart.routes');
const orderRoutes = require('./order.routes');

const router = express.Router();

// Customer routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);

module.exports = router; 