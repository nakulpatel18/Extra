// -- expense-tracker-frontend\src\App.js --

import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
// Admin Panel Imports
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import AllExpenses from './pages/AllExpenses';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
    const navigate = useNavigate();

    // The storage event listener is still useful for cross-tab sync,
    // but direct state updates will handle the current tab.
    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('userRole');
            setIsLoggedIn(!!token);
            setUserRole(role);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Console log for debugging the userRole state
    // You can remove this useEffect after confirming the admin link works
    useEffect(() => {
        console.log('App.js - Current userRole state:', userRole);
    }, [userRole]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        setUserRole(null);
        navigate('/');
    };

    return (
        <div className="app-wrapper">
            <header className="app-header">
                <h1>Expense Tracker</h1>
                <nav>
                    <Link to="/">Home</Link>
                    {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}
                    {isLoggedIn && userRole === 'admin' && <Link to="/admin">Admin Panel</Link>}
                    {!isLoggedIn && <Link to="/login">Login</Link>}
                    {!isLoggedIn && <Link to="/register">Register</Link>}
                    {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
                </nav>
            </header>

            <main className="app-content">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
                    {/* Pass setUserRole to Login and Register components */}
                    <Route 
                        path="/login" 
                        element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} /> : <Navigate to="/dashboard" />} 
                    />
                    <Route 
                        path="/register" 
                        element={!isLoggedIn ? <Register setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} /> : <Navigate to="/dashboard" />} 
                    />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />

                    {/* Admin Panel Routes */}
                    <Route path="/admin" element={isLoggedIn && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
                    <Route path="/admin/users" element={isLoggedIn && userRole === 'admin' ? <UserManagement /> : <Navigate to="/login" />} />
                    <Route path="/admin/expenses" element={isLoggedIn && userRole === 'admin' ? <AllExpenses /> : <Navigate to="/login" />} />
                </Routes>
            </main>

            <footer className="app-footer">
                <p>&copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;