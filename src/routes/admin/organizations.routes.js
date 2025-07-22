// routes/admin/organizations.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../../controllers/admin/organizations.controller');

router.post('/signup', authController.signupUser);
router.post('/verify-otp', authController.verifyOtp);
router.post('/save-organization', authController.saveOrganization); // New route

module.exports = router;