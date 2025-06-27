// -- expense-tracker-frontend\src\pages\UserManagement.js --

import React, { useState, useEffect } from 'react';
import api from '../api/api'; // Use your custom api instance
import '../pages/Admin.css'; // Adjust path if Admin.css is not in the same folder as the pages

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const currentUserId = localStorage.getItem('userId'); // Get current logged-in admin's ID

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
            setMessage('');
            setError('');
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.response?.data?.error || 'Failed to fetch users.');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChangeRole = async (userId, currentRole) => {
        const newRole = currentRole === 'user' ? 'admin' : 'user';
        if (window.confirm(`Are you sure you want to change role of ${userId} to ${newRole}?`)) {
            try {
                const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
                setMessage(res.data.message);
                fetchUsers(); // Re-fetch users to update the list
            } catch (err) {
                console.error('Error changing user role:', err);
                setError(err.response?.data?.message || 'Failed to change user role.');
            }
        }
    };

    const handleDeleteUser = async (userId, userEmail) => {
        if (userId === currentUserId) {
            setError("You cannot delete your own admin account from here.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete user ${userEmail} and all their data? This action is irreversible.`)) {
            try {
                const res = await api.delete(`/admin/users/${userId}`);
                setMessage(res.data.message);
                fetchUsers(); // Re-fetch users to update the list
            } catch (err) {
                console.error('Error deleting user:', err);
                setError(err.response?.data?.message || 'Failed to delete user.');
            }
        }
    };

    return (
        <div className="admin-container">
            <h2>Manage Users</h2>
            {message && <p className="message success-message">{message}</p>}
            {error && <p className="message error-message">{error}</p>}
            
            <div className="admin-table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    {/* Prevent changing role or deleting the currently logged-in admin */}
                                    {user._id !== currentUserId && (
                                        <>
                                            <button 
                                                className="admin-action-button" 
                                                onClick={() => handleChangeRole(user._id, user.role)}
                                            >
                                                {user.role === 'user' ? 'Make Admin' : 'Make User'}
                                            </button>
                                            <button 
                                                className="admin-action-button delete-button" 
                                                onClick={() => handleDeleteUser(user._id, user.email)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                    {user._id === currentUserId && (
                                        <span className="current-admin-text">(You)</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;