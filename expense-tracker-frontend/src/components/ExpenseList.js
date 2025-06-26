import React from 'react';

const ExpenseList = ({ expenses, onEdit, onDelete }) => (
    <div className="list-section">
        <h2>Expenses</h2>
        <ul>
            {expenses.map((expense) => (
                <li key={expense._id}>
                    <span>{expense.title} - ₹{expense.amount} - {expense.category}</span>
                    <div className="actions">
                        <button onClick={() => onEdit(expense)}>Edit</button>
                        <button onClick={() => onDelete(expense._id)}>Delete</button>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

export default ExpenseList;
