// -- expense-tracker-backend\controllers\profileController.js --

const User = require('../models/User');
const bcrypt = require('bcrypt');

/**
 * @desc    Get logged in user's profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
    try {
        console.log("DEBUG: profileController.js - getUserProfile: req.user:", req.user);
        console.log("DEBUG: profileController.js - getUserProfile: req.user.id:", req.user.id);
        // req.user.id is set by the auth.middleware.js
        const user = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpire -__v');
        if (!user) {
            console.warn("DEBUG: profileController.js - getUserProfile: User not found for ID:", req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        res.status(500).json({ message: 'Server error fetching profile', error: error.message });
    }
};

/**
 * @desc    Update logged in user's profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
    const { name, email } = req.body; // Allow updating name and email
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the new email already exists for another user
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                return res.status(400).json({ message: 'Email already in use by another account.' });
            }
        }

        user.name = name || user.name;
        user.email = email || user.email;

        const updatedUser = await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role // Ensure role is still returned
            }
        });
    } catch (error) {
        console.error("❌ Error updating user profile:", error);
        res.status(500).json({ message: 'Server error updating profile', error: error.message });
    }
};

/**
 * @desc    Change logged in user's password
 * @route   PUT /api/users/change-password
 * @access  Private
 */
const changeUserPassword = async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Basic validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: 'Please enter all password fields.' });
    }
    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: 'New passwords do not match.' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect.' });
        }

        // Hash new password and save
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password changed successfully.' });
    } catch (error) {
        console.error("❌ Error changing password:", error);
        res.status(500).json({ message: 'Server error changing password', error: error.message });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    changeUserPassword
};