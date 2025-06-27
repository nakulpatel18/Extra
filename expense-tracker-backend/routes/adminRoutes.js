// -- expense-tracker-backend\routes\adminRoutes.js --

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Expense = require('../models/Expense');
const adminAuth = require('../middlewares/adminAuth.middleware'); // Import admin auth middleware
const bcrypt = require('bcrypt'); // Required for updating user passwords/roles

// Middleware to ensure all routes in this file are admin-protected
router.use(adminAuth);

// @route   GET /api/admin/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update a user's role (Admin only)
// @access  Private (Admin)
router.put('/users/:id/role', async (req, res) => {
    const { role } = req.body; // Expects role: 'user' or 'admin'
    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role provided.' });
    }
    try {
        // Prevent admin from changing their own role via this panel to avoid locking out
        if (req.params.id === req.user.id && role !== 'admin') {
            return res.status(403).json({ message: 'Admins cannot demote themselves via this panel.' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.role = role;
        await user.save();
        res.json({ message: `User ${user.email} role updated to ${role}.`, user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user (Admin only)
// @access  Private (Admin)
router.delete('/users/:id', async (req, res) => {
    try {
        // Prevent admin from deleting their own account via this panel
        if (req.params.id === req.user.id) {
            return res.status(403).json({ message: 'Admins cannot delete their own account via this panel.' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await user.deleteOne(); // Use deleteOne() on the document instance
        // Also delete all expenses/incomes associated with this user
        await Expense.deleteMany({ user: req.params.id });

        res.json({ message: `User ${user.email} and all associated data removed.` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/expenses
// @desc    Get all expenses from all users (Admin only)
// @access  Private (Admin)
router.get('/expenses', async (req, res) => {
    try {
        // Populate the 'user' field to include user details with each expense
        const expenses = await Expense.find().populate('user', 'name email'); // Fetch name and email of user
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/admin/expenses/:id
// @desc    Delete any expense (Admin only)
// @access  Private (Admin)
router.delete('/expenses/:id', async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found.' });
        }

        await expense.deleteOne(); // Use deleteOne() on the document instance
        res.json({ message: 'Expense removed by Admin.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;