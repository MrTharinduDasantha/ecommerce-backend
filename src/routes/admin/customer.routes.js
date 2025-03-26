const express = require('express');
const userController = require('../../controllers/admin/customer.controller');

const router = express.Router();

// Admin User Routes
router.get('/', userController.getAllUsers);
router.put('/:id/status', userController.updateUserStatus);
router.get('/roles', userController.getRoles);

module.exports = router; 