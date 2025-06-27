

const express = require('express');
const router = express.Router();
// const {register, login} = require('../controllers/authControllers');
const {register, login, forgotPassword, resetPassword} = require('../controllers/authControllers'); // Import new functions


router.post('/register', register);
router.post('/login', login);

router.post('/forgot-password', forgotPassword); // New route
router.post('/reset-password/:token', resetPassword); // New route with token parameter

console.log('Auth routes loaded');

module.exports = router;
