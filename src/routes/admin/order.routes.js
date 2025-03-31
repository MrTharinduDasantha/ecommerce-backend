const express = require('express');
const orderController = require('../../controllers/admin/order.controller');

const router = express.Router();

// Admin Order Routes
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router; 