// -- expense-tracker-frontend\src\pages\AllExpenses.js --

import React, { useState, useEffect } from 'react';
import api from '../api/api'; // Use your custom api instance
import '../pages/Admin.css'; // Adjust path if Admin.css is not in the same folder as the pages

const AllExpenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const fetchAllExpenses = async () => {
        try {
            const res = await api.get('/admin/expenses');
            setExpenses(res.data);
            setMessage('');
            setError('');
        } catch (err) {
            console.error('Error fetching all expenses:', err);
            setError(err.response?.data?.error || 'Failed to fetch all expenses.');
        }
    };

    useEffect(() => {
        fetchAllExpenses();
    }, []);

    const handleDeleteExpense = async (expenseId, expenseTitle) => {
        if (window.confirm(`Are you sure you want to delete the entry "${expenseTitle}"? This action is irreversible.`)) {
            try {
                const res = await api.delete(`/admin/expenses/${expenseId}`);
                setMessage(res.data.message);
                fetchAllExpenses(); // Re-fetch expenses to update the list
            } catch (err) {
                console.error('Error deleting expense:', err);
                setError(err.response?.data?.message || 'Failed to delete expense.');
            }
        }
    };

    const getLocalDateString = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Format as local date string
    };

    return (
        <div className="admin-container">
            <h2>All Transactions</h2>
            {message && <p className="message success-message">{message}</p>}
            {error && <p className="message error-message">{error}</p>}

            <div className="admin-table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>User Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense) => (
                            <tr key={expense._id}>
                                <td>{expense.title}</td>
                                <td>₹{expense.amount}</td>
                                <td>{expense.type}</td>
                                <td>{expense.category}</td>
                                <td>{getLocalDateString(expense.date)}</td>
                                <td>{expense.user ? expense.user.email : 'N/A'}</td> {/* Display user email */}
                                <td>
                                    <button 
                                        className="admin-action-button delete-button" 
                                        onClick={() => handleDeleteExpense(expense._id, expense.title)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllExpenses;