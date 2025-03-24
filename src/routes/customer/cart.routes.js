const express = require('express');
const cartController = require('../../controllers/customer/cart.controller');

const router = express.Router();

// Customer Cart Routes
router.get('/:customer_id', cartController.getCart);
router.post('/:customer_id/add', cartController.addToCart);

module.exports = router; 