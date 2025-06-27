// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const User = require('../models/User');

// const register = async (req, res) => {
//     const { name, email, password } = req.body;
//      console.log("Incoming registration data:", req.body);
//      console.log(process.env.JWT_SECRET)
//     try {
//         const hash = await bcrypt.hash(password, 10);
//         const user = new User({ name, email, password: hash });
//         await user.save();
        
//     const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET);
//         console.log('User registered:', user);
//         res.status(200).json({status:200, token, data:user, message:'success'});
//     } catch (error) {
//     console.error("❌ Error in registration:", error); // log full error
//     res.status(500).json({ message: 'Registration failed', error: error.message });
//     }
// };

// const login = async (req, res) => {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if(!user) return res.status(401).send('Invalid credentials');
//     console.log('User found:', user);
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).send('Invalid credentials');

//     const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET);
//     res.json({token, role: user.role});
// };

// module.exports = {
//     register,
//     login,
// };



// -- expense-tracker-backend\controllers\authControllers.js --

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const crypto = require('crypto'); // Built-in Node.js module for cryptography
const nodemailer = require('nodemailer'); // Import Nodemailer

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
    const { name, email, password } = req.body;
    console.log("Incoming registration data:", req.body);
    // console.log(process.env.JWT_SECRET); // Good for debugging, but be careful not to log secrets in production

    try {
        // Check if user already exists
        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with that email already exists' });
        }

        // Hash the password
        const hash = await bcrypt.hash(password, 10);
        
        // Create new user instance
        const user = new User({ name, email, password: hash });
        
        // Save user to database
        await user.save();
        
        // Generate JWT token for immediate login
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

        console.log('User registered:', user.email);
        res.status(200).json({ status: 200, token, data: { id: user._id, name: user.name, email: user.email, role: user.role }, message: 'Registration successful' });
    } catch (error) {
        console.error("❌ Error in registration:", error); // log full error
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Compare provided password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

        console.log('User logged in:', user.email);
        res.json({ token, role: user.role, userId: user._id }); // Also send userId to frontend if needed
    } catch (error) {
        console.error("❌ Error in login:", error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

/**
 * @desc    Request password reset link
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour

        await user.save();

        // --- CRITICAL CHANGE HERE ---
        // Define your frontend URL explicitly.
        // For development: http://localhost:3000
        // For production: your_domain.com (e.g., https://www.your-expense-tracker.com)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'; // Add FRONTEND_URL to .env

        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`; // Point to frontend route

        // Create email transporter (rest of this section is unchanged)
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

/**
 * @desc    Reset user password using token
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = async (req, res) => {
    // Hash the token from the URL to compare with the stored hashed token in the database
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    try {
        // Find user by hashed token and ensure it's not expired
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }, // $gt means "greater than" (token must be in the future)
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        // Set the new password and hash it
        user.password = await bcrypt.hash(req.body.password, 10);
        
        // Clear the reset token fields after successful reset
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

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

