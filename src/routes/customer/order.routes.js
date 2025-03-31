const express = require('express');
const orderController = require('../../controllers/customer/order.controller');

const router = express.Router();

// Customer Order Routes
router.get('/:customer_id', orderController.getCustomerOrders);
router.post('/', orderController.createOrder);

module.exports = router; 