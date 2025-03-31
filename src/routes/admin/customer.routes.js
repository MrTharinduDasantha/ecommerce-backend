const express = require('express');
const customerController = require('../../controllers/admin/customer.controller');

const router = express.Router();

// Admin Customer Routes
router.get('/', customerController.getCustomers);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);
router.get('/:id/history', customerController.getCustomerHistory);


module.exports = router;
