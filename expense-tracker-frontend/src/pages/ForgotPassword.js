import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import '../pages/ProfileAuthForms.css'; 

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
            setMessage(res.data.message || 'Password reset link sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please check your email.');
        }
    };

    return (
        <div className="form-container-wrapper"> 
            <form onSubmit={handleSubmit} className="auth-form-card"> 
                <h2>Forgot Password</h2>
                <p>Enter your email address to receive a password reset link.</p>

                <div className="form-group"> 
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

                {message && <p className="message">{message}</p>}
                {error && <p className="message error-message">{error}</p>}

                <p className="footer">
                    Remember your password? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;
