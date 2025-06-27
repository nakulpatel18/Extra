// -- expense-tracker-backend\routes\expenses.js --

const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middlewares/auth.middleware'); // Import the auth middleware

// Get all expenses for the authenticated user
// This route is now PROTECTED
router.get('/', auth, async (req, res) => {
    try {
        // Find expenses where the 'user' field matches the ID from the token
        const expenses = await Expense.find({ user: req.user.id });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new expense for the authenticated user
// This route is now PROTECTED
router.post('/', auth, async (req, res) => {
    const { title, amount, category, type, date } = req.body;
    
    // Create a new expense and link it to the authenticated user's ID
    const newExpense = new Expense({
        title,
        amount,
        category,
        type,
        date,
        user: req.user.id // <-- ADD THE USER ID HERE
    });

    try {
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an expense for the authenticated user
// This route is now PROTECTED
router.put('/:id', auth, async (req, res) => {
    try {
        // Find the expense by ID AND ensure it belongs to the authenticated user
        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id }, // Find by ID and user
            {
                title: req.body.title,
                amount: req.body.amount,
                category: req.body.category,
                type: req.body.type,
                date: new Date(req.body.date)
            },
            { new: true } // Return the updated document
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: 'Expense not found or you are not authorized to update it.' });
        }
        
        res.json(updatedExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an expense for the authenticated user
// This route is now PROTECTED
router.delete('/:id', auth, async (req, res) => {
    try {
        // Find and delete the expense by ID AND ensure it belongs to the authenticated user
        const deletedExpense = await Expense.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.user.id 
        });

        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense not found or you are not authorized to delete it.' });
        }

        res.json({ message: 'Expense deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;