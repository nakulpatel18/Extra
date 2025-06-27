// -- expense-tracker-backend\models\Expense.js -- 

const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    type: {
        type: String,  // "income" or "expense"
        required: true
    },
    // ADD THIS FIELD to link the expense/income to a user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This tells Mongoose to reference the 'User' model
        required: true // A transaction must belong to a user
    }
});

module.exports = mongoose.model('Expense', ExpenseSchema);