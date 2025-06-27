
// -- expense-tracker-frontend\src\pages\Login.js --

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api'; // Use custom api instance for consistency
import './Login.css';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Use custom api instance
            const res = await api.post('/auth/login', { email, password });
            if (res.status === 200) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userRole', res.data.role); // NEW: Store user role
                localStorage.setItem('userId', res.data.userId); // NEW: Store user ID
                setIsLoggedIn(true);
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login to Your Account</h2>

                <div className='id'>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </div>

                <div className='id'>
                    <label htmlFor="password">Password</label>
                    <div className="input-with-icon">
                        <input 
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                        <span
                            className="toggle-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
                        </span>
                    </div>
                </div>

                <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>

                <button type="submit">Login</button>

                {error && <p className="error-message">{error}</p>}

                <p className="footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;