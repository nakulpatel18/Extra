// -- expense-tracker-frontend\src\pages\ForgotPassword.js --

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api'; // Use your custom axios instance
import './Login.css'; // You can reuse some styles from Login.css

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setMessage(res.data.message || 'Password reset link sent to your email if it exists.');
            setEmail(''); // Clear the email field
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
            console.error('Forgot password error:', err);
        }
    };

    return (
        <div className="login-container"> {/* Reusing login container style */}
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Forgot Password</h2>
                <p>Enter your email address to receive a password reset link.</p>

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

                <button type="submit">Send Reset Link</button>

                {message && <p className="message success-message">{message}</p>}
                {error && <p className="message error-message">{error}</p>}

                <p className="footer">
                    Remember your password? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;