// -- expense-tracker-backend\routes\userRoutes.js --

const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware'); // Import your authentication middleware
const profileController = require('../controllers/profileController'); // Import the new profile controller

// @route   GET /api/users/profile
// @desc    Get logged in user's profile
// @access  Private
router.get('/profile', auth, profileController.getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update logged in user's profile
// @access  Private
router.put('/profile', auth, profileController.updateUserProfile);

// @route   PUT /api/users/change-password
// @desc    Change logged in user's password
// @access  Private
router.put('/change-password', auth, profileController.changeUserPassword);

module.exports = router;