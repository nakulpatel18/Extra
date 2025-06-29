const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

/* Register a new user */
const register = async (req, res) => {
    const { name, email, password } = req.body;
    console.log("Incoming registration data:", req.body);

    try {
        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with that email already exists' });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hash });
        await user.save();
        
        // When registering, default role is 'user'. Send it to frontend.
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('User registered:', user.email);
        res.status(200).json({ status: 200, token, data: { id: user._id, name: user.name, email: user.email, role: user.role }, message: 'Registration successful' });
    } catch (error) {
        console.error("❌ Error in registration:", error);
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

/* Authenticate user & get token */
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Ensure role and userId are explicitly sent here for frontend to use
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('User logged in:', user.email);
        res.json({ token, role: user.role, userId: user._id }); 
    } catch (error) {
        console.error("❌ Error in login:", error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

/* Request password reset link */
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000;

        await user.save();
        console.log('User saved successfully after forgot password request.');

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'; 
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT, 10),
            secure: process.env.EMAIL_PORT === '465',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false 
            }
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Expense Tracker: Password Reset Request',
            html: `
                <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
                <p>This link will expire in 1 hour.</p>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("❌ Error sending email:", error);
                return res.status(500).json({ message: 'There was an issue sending the password reset email. Please try again later.' });
            }
            console.log('✅ Password reset email sent to:', user.email);
            res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
        });

    } catch (error) {
        console.error("❌ Error in forgot password request:", error);
        res.status(500).json({ message: 'Server error during password reset request.' });
    }
};

/* Reset user password using token */
const resetPassword = async (req, res) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            console.error('User not found or token expired based on query.');
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        console.log('User found for reset:', user.email);
        
        user.password = await bcrypt.hash(req.body.password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        console.log('Password reset successfully for user:', user.email);

        res.status(200).json({ message: 'Password has been reset successfully. You can now log in with your new password.' });

    } catch (error) {
        console.error("❌ Error in reset password:", error);
        res.status(500).json({ message: 'Server error during password reset.' });
    }
};

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
};
