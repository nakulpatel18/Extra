const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middlewares/auth.middleware');

// Get all expenses for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new expense for the authenticated user
router.post('/', auth, async (req, res) => {
    const { title, amount, category, type, date } = req.body;

    const newExpense = new Expense({
        title,
        amount,
        category,
        type,
        date,
        user: req.user.id
    });

    try {
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an expense for the authenticated user
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            {
                title: req.body.title,
                amount: req.body.amount,
                category: req.body.category,
                type: req.body.type,
                date: new Date(req.body.date)
            },
            { new: true }
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
router.delete('/:id', auth, async (req, res) => {
    try {
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