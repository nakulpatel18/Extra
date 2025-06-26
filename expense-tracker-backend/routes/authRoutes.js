

const express = require('express');
const router = express.Router();
const {register, login} = require('../controllers/authControllers');

router.post('/register', register);
router.post('/login', login);
console.log('Auth routes loaded');

module.exports = router;
