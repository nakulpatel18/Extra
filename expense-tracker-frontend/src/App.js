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
    // State to store user role (used for conditional rendering of Admin link/routes)
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
    const navigate = useNavigate();

    // Effect to listen for changes in localStorage (e.g., login/logout)
    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('userRole');
            setIsLoggedIn(!!token);
            setUserRole(role); // Update userRole state when localStorage changes
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Console log for debugging the userRole state
    // You can remove this useEffect after confirming the admin link works
    useEffect(() => {
        console.log('App.js - Current userRole state:', userRole);
    }, [userRole]);

    // Function to handle user logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole'); // Remove user role from local storage
        localStorage.removeItem('userId'); // Remove user ID from local storage
        setIsLoggedIn(false);
        setUserRole(null); // Clear user role state
        navigate('/'); // Redirect to home/landing page
    };

    return (
        <div className="app-wrapper">
            <header className="app-header">
                <h1>Expense Tracker</h1>
                <nav>
                    <Link to="/">Home</Link>
                    {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}
                    {/* Conditional rendering for Admin Panel link */}
                    {isLoggedIn && userRole === 'admin' && <Link to="/admin">Admin Panel</Link>}
                    {!isLoggedIn && <Link to="/login">Login</Link>}
                    {!isLoggedIn && <Link to="/register">Register</Link>}
                    {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
                </nav>
            </header>

            <main className="app-content">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    {/* Protected Dashboard route */}
                    <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
                    {/* Login/Register routes redirect if already logged in */}
                    <Route path="/login" element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/dashboard" />} />
                    <Route path="/register" element={!isLoggedIn ? <Register setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/dashboard" />} />
                    {/* Password Reset routes */}
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />

                    {/* Admin Panel Routes - Protected by role check */}
                    {/* Only accessible if user is logged in AND has 'admin' role */}
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

