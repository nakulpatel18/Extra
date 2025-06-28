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
// Profile Imports
import Profile from './pages/Profile';
import UpdateProfile from './pages/UpdateProfile';
import ChangePassword from './pages/ChangePassword';
// Import Font Awesome user icon
import { FaUserCircle } from 'react-icons/fa';


const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
    const navigate = useNavigate();

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

    useEffect(() => {
        console.log('App.js - Current userRole state:', userRole);
    }, [userRole]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        setUserRole(null);
        navigate('/'); // REDIRECT TO Landing PAGE AFTER LOGOUT
    };

    return (
        <div className="app-wrapper">
            <header className="app-header">
                <h1>Expense Tracker</h1>
                <nav className="main-nav">
                    <div className="main-links">
                        <Link to="/">Home</Link>
                        {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}
                        {isLoggedIn && userRole === 'admin' && <Link to="/admin">Admin Panel</Link>}
                        
                        {/* Show Login/Register links directly when NOT logged in */}
                        {!isLoggedIn && (
                            <>
                                <Link to="/login">Login</Link>
                                <Link to="/register">Register</Link>
                            </>
                        )}
                    </div>
                    
                    <div className="auth-links">
                        {/* Only show profile/logout when logged in */}
                        {isLoggedIn && (
                            <>
                                <Link to="/profile" className="profile-icon-link">
                                    <FaUserCircle size={28} color="white" />
                                </Link>
                                <button onClick={handleLogout} className="nav-button">Logout</button>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            <main className="app-content">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
                    
                    <Route path="/login" element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} /> : <Navigate to="/dashboard" />} />
                    <Route path="/register" element={!isLoggedIn ? <Register setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} /> : <Navigate to="/dashboard" />} />

                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />

                    {/* Admin Panel Routes */}
                    <Route path="/admin" element={isLoggedIn && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
                    <Route path="/admin/users" element={isLoggedIn && userRole === 'admin' ? <UserManagement /> : <Navigate to="/login" />} />
                    <Route path="/admin/expenses" element={isLoggedIn && userRole === 'admin' ? <AllExpenses /> : <Navigate to="/login" />} />
                    
                    {/* User Profile Routes */}
                    <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
                    <Route path="/profile/update" element={isLoggedIn ? <UpdateProfile /> : <Navigate to="/login" />} />
                    <Route path="/profile/change-password" element={isLoggedIn ? <ChangePassword /> : <Navigate to="/login" />} />
                </Routes>
            </main>

            <footer className="app-footer">
                <p>&copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;