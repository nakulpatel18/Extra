const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user',
    },
    // Fields for password reset token and its expiration
    resetPasswordToken: String,    // Stores the hashed reset token
    resetPasswordExpires: Date,    // Stores the expiration timestamp
});

module.exports = mongoose.model('User', userSchema);
