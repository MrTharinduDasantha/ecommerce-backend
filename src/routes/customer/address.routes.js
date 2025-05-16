const express = require('express');
const addressController = require('../../controllers/customer/address.controller');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

// All routes in this file should require customer authentication
router.use(authenticateToken);

// GET /api/customers/:customer_id/addresses - Get all addresses for a customer
router.get('/:customer_id/addresses', addressController.getAddresses);

// POST /api/customers/:customer_id/addresses - Add a new address for a customer
router.post('/:customer_id/addresses', addressController.addAddress);

// GET /api/customers/:customer_id/addresses/:id - Get a specific address
router.get('/:customer_id/addresses/:id', addressController.getAddressById);

// PUT /api/customers/:customer_id/addresses/:id - Update an address
router.put('/:customer_id/addresses/:id', addressController.updateAddress);

// DELETE /api/customers/:customer_id/addresses/:id - Delete an address
router.delete('/:customer_id/addresses/:id', addressController.deleteAddress);

module.exports = router; 