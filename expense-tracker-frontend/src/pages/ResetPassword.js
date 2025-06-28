// -- expense-tracker-frontend\src\pages\ResetPassword.js --

import React, { useState } from 'react'
    import { useParams, useNavigate, Link } from 'react-router-dom';
    import api from '../api/api';
    import '../pages/ProfileAuthForms.css'; // Import from NEW combined CSS
    import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        try {
            const res = await api.post(`/auth/reset-password/${token}`, { newPassword });
            setMessage(res.data.message || 'Password has been reset successfully!');
            setTimeout(() => {
                navigate('/login'); // Redirect to login after successful reset
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Password reset failed. Please try again.');
        }
    };

    return (
        <div className="form-container-wrapper"> {/* Uses common wrapper class */}
            <form onSubmit={handleSubmit} className="auth-form-card"> {/* Uses common form card class */}
                <h2>Reset Password</h2>
                <p>Enter your new password.</p>

                <div className="form-group"> {/* Uses common form-group class */}
                    <label htmlFor="newPassword">New Password</label>
                    <div className="input-with-icon">
                        <input
                            id="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="Enter new password"
                        />
                        <span className="toggle-icon" onClick={() => setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
                        </span>
                    </div>
                </div>

                <div className="form-group"> {/* Uses common form-group class */}
                    <label htmlFor="confirmNewPassword">Confirm New Password</label>
                    <div className="input-with-icon">
                        <input
                            id="confirmNewPassword"
                            type={showConfirmNewPassword ? 'text' : 'password'}
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                            placeholder="Confirm new password"
                        />
                        <span className="toggle-icon" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                            {showConfirmNewPassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
                        </span>
                    </div>
                </div>

                <button type="submit">Reset Password</button>

                {message && <p className="message">{message}</p>}
                {error && <p className="message error-message">{error}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;
