// -- expense-tracker-frontend\src\pages\Login.js --

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import './Login.css';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

function Login({ setIsLoggedIn, setUserRole, onSuccess, switchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            if (res.status === 200) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userRole', res.data.role);
                localStorage.setItem('userId', res.data.userId);

                setIsLoggedIn(true);
                setUserRole(res.data.role);

                if (onSuccess) {
                    onSuccess(); // close modal + redirect
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login to Your Account</h2>

                <div className='form-group'>
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

                <div className='form-group'>
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

                {error && <p className="message error-message">{error}</p>}

                <p className="footer">
                    Don't have an account?{' '}
                    <span
                        style={{ color: 'skyblue', cursor: 'pointer' }}
                        onClick={switchToRegister}
                    >
                        Register
                    </span>
                </p>
            </form>
        </div>
    );
}

export default Login;
