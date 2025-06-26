import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './App.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));




    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem('token'));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        window.location.href = '/login';
    };

    return (
        <div className="app-wrapper">
            <Router>
                <header className="app-header">
                    <h1>Expense Tracker</h1>
                    <nav>
                        <Link to="/">Dashboard</Link>
                        {!isLoggedIn && <Link to="/login">Login</Link>}
                        {!isLoggedIn && <Link to="/register">Register</Link>}
                        {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
                    </nav>
                </header>

                <main className="app-content">
                    <Routes>
                        <Route path="/" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
                        <Route path="/login" element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />} />
                        <Route path="/register" element={!isLoggedIn ? <Register setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />} />
                    </Routes>
                </main>

                <footer className="app-footer">
                    <p>&copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
                </footer>
            </Router>
        </div>
    );

};

export default App;