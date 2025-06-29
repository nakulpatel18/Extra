// -- expense-tracker-backend\models\User.js --

const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Import bcrypt for pre-save hook if you use it

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    
    resetPasswordToken: String,
    resetPasswordExpire: Date, // Store as Date type
});


module.exports = mongoose.model('User', UserSchema);