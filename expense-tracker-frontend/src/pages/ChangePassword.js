import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../pages/ProfileAuthForms.css'; 
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (formData.newPassword !== formData.confirmNewPassword) {
            setError('New passwords do not match.');
            return;
        }
        if (formData.newPassword.length < 6) {
            setError('New password must be at least 6 characters long.');
            return;
        }

        try {
            const res = await api.put('/users/change-password', formData);
            setMessage(res.data.message || 'Password changed successfully!');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            }); // Clear form fields
            setTimeout(() => {
                navigate('/profile');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password. Please check your current password.');
            console.error('Change password error:', err.response ? err.response.data : err.message);
        }
    };

    return (
        <div className="form-container-wrapper">
            <form onSubmit={handleSubmit} className="auth-form-card">
                <h2>Change Password</h2>

                {error && <p className="message error-message">{error}</p>}
                {message && <p className="message">{message}</p>}

                <div className='form-group'>
                    <label htmlFor="currentPassword">Current Password</label>
                    <div className="input-with-icon">
                        <input
                            id="currentPassword"
                            type={showCurrentPassword ? 'text' : 'password'}
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                            placeholder="Enter current password"
                        />
                        <span className="toggle-icon" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                            {showCurrentPassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
                        </span>
                    </div>
                </div>

                <div className='form-group'> 
                    <label htmlFor="newPassword">New Password</label>
                    <div className="input-with-icon">
                        <input
                            id="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            placeholder="Enter new password"
                        />
                        <span className="toggle-icon" onClick={() => setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
                        </span>
                    </div>
                </div>

                <div className='form-group'> 
                    <label htmlFor="confirmNewPassword">Confirm New Password</label>
                    <div className="input-with-icon">
                        <input
                            id="confirmNewPassword"
                            type={showConfirmNewPassword ? 'text' : 'password'}
                            name="confirmNewPassword"
                            value={formData.confirmNewPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm new password"
                        />
                        <span className="toggle-icon" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                            {showConfirmNewPassword ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
                        </span>
                    </div>
                </div>

                <button type="submit">Change Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;

