const express = require('express');
const customerController = require('../../controllers/admin/customer.controller');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all customer routes
router.use(authenticateToken);

// Admin Customer Routes
router.get('/', customerController.getCustomers);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);
router.get('/:id/history', customerController.getCustomerHistory);

module.exports = router;