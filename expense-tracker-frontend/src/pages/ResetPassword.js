// -- expense-tracker-frontend\src\pages\ResetPassword.js --

import React, { useState, useEffect } from 'react'; // Added useEffect for logging/debugging
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api'; // Use your custom api instance
import './Login.css'; // Reusing login container styles
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const ResetPassword = () => {
    const { token } = useParams(); // Get the token from the URL
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // UseEffect to log the token from URL parameters for debugging
    useEffect(() => {
        if (token) {
            console.log("Token from URL params:", token);
        } else {
            setError("No reset token found in the URL. Please use the link from your email.");
        }
    }, [token]); // Dependency array includes 'token' to re-run if token changes (though it shouldn't for this component)


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages
        setError('');   // Clear previous errors

        if (!token) {
            setError("Missing reset token. Please use the complete link from your email.");
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) { // Basic password length validation
            setError('Password must be at least 6 characters long.');
            return;
        }

        try {
            // Send the new password and the token to the backend
            const res = await api.post(`/auth/reset-password/${token}`, { password });
            setMessage(res.data.message || 'Password has been reset successfully!');
            setPassword('');
            setConfirmPassword('');
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 3000); // 3-second delay

        } catch (err) {
            // Handle error response from backend
            setError(err.response?.data?.message || 'Failed to reset password. Token might be invalid or expired or server error.');
            console.error('Reset password error:', err.response ? err.response.data : err.message);
        }
    };

    return (
        <div className="login-container"> {/* Reusing login container style */}
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Reset Password</h2>
                <p>Enter your new password.</p>

                <div className='id'>
                    <label htmlFor="password">New Password</label>
                    <div className="input-with-icon">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter new password"
                        />
                        <span
                            className="toggle-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
                        </span>
                    </div>
                </div>

                <div className='id'>
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <div className="input-with-icon">
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm new password"
                        />
                        <span
                            className="toggle-icon"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
                        </span>
                    </div>
                </div>

                <button type="submit">Reset Password</button>

                {/* Display messages */}
                {message && <p className="message success-message">{message}</p>}
                {error && <p className="message error-message">{error}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;