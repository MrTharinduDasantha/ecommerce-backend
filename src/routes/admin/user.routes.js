const express = require('express');
const userController = require('../../controllers/admin/user.controller');

const router = express.Router();

// Admin User Routes
router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/login', userController.loginUser);

module.exports = router;
