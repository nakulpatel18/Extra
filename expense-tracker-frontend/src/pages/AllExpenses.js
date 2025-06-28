// -- expense-tracker-frontend\src\pages\AllExpenses.js --

import React, { useState, useEffect } from 'react';
import api from '../api/api';
import '../pages/Admin.css'; // Reusing admin styles

const AllExpenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null); // State to manage delete confirmation

    useEffect(() => {
        const fetchAllExpenses = async () => {
            try {
                setLoading(true);
                const res = await api.get('/admin/expenses');
                
                // Client-side sorting:
                // 1. Sort by user.name (alphabetically)
                // 2. Then, sort by date (most recent first) within each user group
                const sortedExpenses = res.data.sort((a, b) => {
                    // Primary sort: by username
                    const userNameA = a.user?.name ? a.user.name.toLowerCase() : '';
                    const userNameB = b.user?.name ? b.user.name.toLowerCase() : '';

                    if (userNameA < userNameB) return -1;
                    if (userNameA > userNameB) return 1;

                    // Secondary sort: by date (descending) if usernames are the same
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB - dateA; // Most recent first
                });

                setExpenses(sortedExpenses);
                setError('');
            } catch (err) {
                console.error('Error fetching all expenses:', err);
                setError(err.response?.data?.message || 'Failed to load all expenses.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllExpenses();
    }, []);

    const handleDelete = async (expenseId) => {
        try {
            await api.delete(`/admin/expenses/${expenseId}`);
            setExpenses(expenses.filter(expense => expense._id !== expenseId));
            setConfirmDelete(null); // Close confirmation after delete
        } catch (err) {
            console.error('Error deleting expense:', err);
            setError(err.response?.data?.message || 'Failed to delete expense.');
        }
    };

    if (loading) {
        return <div className="admin-container">Loading all expenses...</div>;
    }

    if (error) {
        return <div className="admin-container"><p className="error-message">{error}</p></div>;
    }

    return (
        <div className="admin-container">
            <h2>All Expenses</h2>
            {expenses.length === 0 ? (
                <p>No expenses recorded yet.</p>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User Name</th> {/* Changed from Email to User Name */}
                                <th>Amount</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense._id}>
                                    {/* Display user name instead of email */}
                                    <td>{expense.user ? expense.user.name : 'N/A'}</td> 
                                    <td>₹{expense.amount.toFixed(2)}</td>
                                    <td>{expense.category}</td>
                                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                                    <td className={expense.type === 'expense' ? 'text-red' : 'text-green'}>
                                        {expense.type}
                                    </td>
                                    <td>
                                        {confirmDelete === expense._id ? (
                                            <div className="confirm-buttons">
                                                <button onClick={() => handleDelete(expense._id)} className="button-confirm make">Confirm</button>
                                                <button onClick={() => setConfirmDelete(null)} className="button-cancel">Cancel</button>
                                            </div>
                                        ) : (
                                            <button onClick={() => setConfirmDelete(expense._id)} className="ex-button-delete">Delete</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AllExpenses;
