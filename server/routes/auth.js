const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// POST /api/auth/login - Login with email/phone
router.post('/login', authController.login);

// POST /api/auth/verify-otp - Verify OTP
router.post('/verify-otp', authController.verifyOTP);

// POST /api/auth/register - Register new user
router.post('/register', authController.register);

// GET /api/auth/me - Get current user
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;