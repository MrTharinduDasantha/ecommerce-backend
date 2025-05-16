const express = require('express');
const orderController = require('../../controllers/customer/order.controller');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/:customer_id', orderController.getCustomerOrders);

// Protected routes - require authentication
router.use(authenticateToken);

// Order management
router.get('/:customer_id/history', orderController.getOrderHistory);
router.get('/:customer_id/:id', orderController.getOrderDetails);
router.get('/:customer_id/:id/track', orderController.trackOrderStatus);
router.post('/', orderController.createOrder);
router.post('/:customer_id/orders/:id/cancel', orderController.cancelOrder);

module.exports = router; 