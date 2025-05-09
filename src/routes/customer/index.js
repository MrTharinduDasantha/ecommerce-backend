const express = require('express');
const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const cartRoutes = require('./cart.routes');
const orderRoutes = require('./order.routes');
const addressRoutes = require('./address.routes');

const router = express.Router();

// Customer routes
router.use('/auth/customers', authRoutes);
router.use('/products', productRoutes);
router.use('/carts', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/customers', addressRoutes);

module.exports = router; 