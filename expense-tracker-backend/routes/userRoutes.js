const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const profileController = require('../controllers/profileController'); 

// Get logged in user's profile
router.get('/profile', auth, profileController.getUserProfile);

// Update logged in user's profile
router.put('/profile', auth, profileController.updateUserProfile);

// Change logged in user's password
router.put('/change-password', auth, profileController.changeUserPassword);

module.exports = router;