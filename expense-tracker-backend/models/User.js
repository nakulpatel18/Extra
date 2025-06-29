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
    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    // },
    // ADDED: Fields for password reset functionality
    resetPasswordToken: String,
    resetPasswordExpire: Date, // Store as Date type
});

// Optional: Pre-save hook to hash password if it's modified (ensure this is present if intended)
// UserSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) {
//         return next();
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

module.exports = mongoose.model('User', UserSchema);