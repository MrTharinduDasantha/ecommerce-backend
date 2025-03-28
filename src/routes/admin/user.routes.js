const express = require('express');
const userController = require('../../controllers/admin/user.controller');
const authenticate = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/login', userController.loginUser);
router.post('/', userController.createUser);

router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile); // Add this route

router.get('/:id', userController.getUser);
router.get('/', authenticate, userController.getUsers);
router.put('/:id', authenticate, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

module.exports = router;
