import { Routes, Route, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import AllExpenses from './pages/AllExpenses';
import Profile from './pages/Profile';
import UpdateProfile from './pages/UpdateProfile';
import ChangePassword from './pages/ChangePassword';
import { FaUserCircle } from 'react-icons/fa';

import Modal from 'react-modal';
Modal.setAppElement('#root'); // for accessibility

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
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

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUserRole(null);
        navigate('/');
    };

    const closeModals = () => {
        setShowLoginModal(false);
        setShowRegisterModal(false);
    };

    return (
        <div className="app-wrapper">
            <header className="app-header">
                <h1>Expense Tracker</h1>
                <nav className="main-nav">
                    <div className="main-links">
                        <button onClick={() => navigate('/')}>Home</button>
                        {isLoggedIn && <button onClick={() => navigate('/dashboard')}>Dashboard</button>}
                        {isLoggedIn && userRole === 'admin' && <button onClick={() => navigate('/admin')}>Admin Panel</button>}
                        {!isLoggedIn && (
                            <>
                                <button onClick={() => setShowLoginModal(true)}>Login</button>
                                <button onClick={() => setShowRegisterModal(true)}>Register</button>
                            </>
                        )}
                    </div>
                    {isLoggedIn && (
                        <div className="auth-links">
                            <button onClick={() => navigate('/profile')} className="profile-icon-link">
                                <FaUserCircle size={28} color="white" />
                            </button>
                            <button onClick={handleLogout} className="nav-button">Logout</button>
                        </div>
                    )}
                </nav>
            </header>

            <main className="app-content">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Landing />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/admin" element={isLoggedIn && userRole === 'admin' ? <AdminDashboard /> : <Landing />} />
                    <Route path="/admin/users" element={isLoggedIn && userRole === 'admin' ? <UserManagement /> : <Landing />} />
                    <Route path="/admin/expenses" element={isLoggedIn && userRole === 'admin' ? <AllExpenses /> : <Landing />} />
                    <Route path="/profile" element={isLoggedIn ? <Profile /> : <Landing />} />
                    <Route path="/profile/update" element={isLoggedIn ? <UpdateProfile /> : <Landing />} />
                    <Route path="/profile/change-password" element={isLoggedIn ? <ChangePassword /> : <Landing />} />
                </Routes>
            </main>

            <footer className="app-footer">
                <p>&copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
            </footer>

            {/* Login Modal */}
            <Modal
                isOpen={showLoginModal}
                onRequestClose={closeModals}
                className="modal-content modal-login"
                overlayClassName="modal-overlay"
            >

                <Login
                    setIsLoggedIn={setIsLoggedIn}
                    setUserRole={setUserRole}
                    onSuccess={() => {
                        closeModals();
                        navigate('/dashboard');
                    }}
                    switchToRegister={() => {
                        setShowLoginModal(false);
                        setShowRegisterModal(true);
                    }}
                />
            </Modal>

            {/* Register Modal */}
            <Modal
                isOpen={showRegisterModal}
                onRequestClose={closeModals}
                className="modal-content modal-register"
                overlayClassName="modal-overlay"
            >

                <Register
                    setIsLoggedIn={setIsLoggedIn}
                    setUserRole={setUserRole}
                    onSuccess={() => {
                        closeModals();
                        navigate('/dashboard');
                    }}
                    switchToLogin={() => {
                        setShowRegisterModal(false);
                        setShowLoginModal(true);
                    }}
                />
            </Modal>
        </div>
    );
};

export default App;
