// -- expense-tracker-frontend\src\pages\AdminDashboard.js --

import React from 'react';
import { Link } from 'react-router-dom';
import '../pages/Admin.css'; // Adjust path if Admin.css is not in the same folder as the pages

const AdminDashboard = () => {
    return (
        <div className="admin-container">
            <h2>Admin Panel</h2>
            <p>Welcome, Administrator! Use the links below to manage the application.</p>
            
            <div className="admin-grid">
                <div className="admin-card">
                    <h3>User Management</h3>
                    <p>View, modify, and delete user accounts.</p>
                    <Link to="/admin/users" className="admin-link-button">Manage Users</Link>
                </div>

                <div className="admin-card">
                    <h3>All Expenses</h3>
                    <p>View and manage all transactions across all users.</p>
                    <Link to="/admin/expenses" className="admin-link-button">View All Expenses</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
