const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey';


// Register user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ message: 'Registration successful!', token, data: { id: user.id, role: user.role } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Authenticate user & get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role, userId: user.id });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Request password reset
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour (3600000 ms)

        await user.save();
        // console.log('Forgot Password: User saved with token hash:', user.resetPasswordToken); // Debugging

        const frontendBaseUrl = process.env.FRONTEND_URL || `http://localhost:3000`;
        const resetUrl = `${frontendBaseUrl}/reset-password/${resetToken}`; // Use the UNHASHED token for the URL

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please open this link in your browser to reset: \n\n ${resetUrl} \n\n This token will expire in one hour.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Token',
                message,
            });
            res.status(200).json({ message: 'Password reset email sent successfully.' });
        } catch (err) {
            console.error('Error sending email:', err.message); // More specific error logging
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: 'Email could not be sent. Please try again later.' });
        }

    } catch (err) {
        console.error('Server error during forgot-password:', err.message); // More specific error logging
        res.status(500).send('Server Error');
    }
});


// Reset password using token
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params; // This is the UNHASHED token from the URL
    const { newPassword } = req.body;

    try {
        // HASH THE INCOMING TOKEN EXACTLY AS IT WAS HASHED FOR STORAGE
        const resetTokenHashFromUrl = crypto.createHash('sha256').update(token).digest('hex');
        // console.log('Reset Password: Token from URL (unhashed):', token); // Debugging
        // console.log('Reset Password: Token hash from URL:', resetTokenHashFromUrl); // Debugging

        const user = await User.findOne({
            resetPasswordToken: resetTokenHashFromUrl, // Use the hashed version for query
            resetPasswordExpire: { $gt: Date.now() } // Token must not be expired
        });

        if (!user) {
            // Log details for debugging why user was not found
            console.warn('Reset Password: Invalid or expired token. User not found or token expired.');
            const debugUser = await User.findOne({ resetPasswordToken: resetTokenHashFromUrl });
            if (debugUser) {
                console.warn('Reset Password: User found by token hash, but token expired. Expiry:', debugUser.resetPasswordExpire, 'Current time:', Date.now());
            } else {
                console.warn('Reset Password: No user found with provided token hash.');
            }
            return res.status(400).json({ message: 'Invalid or expired reset token.' });
        }

        if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long and not empty.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear reset token fields after successful reset
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        // console.log('Reset Password: Password successfully reset for user:', user.email); // Debugging

        res.status(200).json({ message: 'Password reset successfully!' });

    } catch (err) {
        console.error('Server error during password reset:', err.message);
        res.status(500).json({ message: 'Server error during password reset.' });
    }
});


module.exports = router;
