// -- expense-tracker-frontend\src\pages\UpdateProfile.js --

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../pages/Login.css'; // Reusing general form styles

const UpdateProfile = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch current user details to pre-fill the form
        const fetchCurrentProfile = async () => {
            try {
                const res = await api.get('/users/profile');
                setFormData({
                    name: res.data.name,
                    email: res.data.email,
                });
            } catch (err) {
                console.error('Error fetching current profile:', err);
                setError(err.response?.data?.message || 'Failed to load current profile details.');
            }
        };
        fetchCurrentProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const res = await api.put('/users/profile', formData);
            setMessage(res.data.message || 'Profile updated successfully!');
            // Optionally update local storage if necessary, though profile data isn't directly used
            // localStorage.setItem('userName', res.data.user.name); // If you plan to display name in header etc.
            setTimeout(() => {
                navigate('/profile'); // Go back to profile view after update
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
            console.error('Update profile error:', err.response ? err.response.data : err.message);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Update Profile Details</h2>

                {error && <p className="message error-message">{error}</p>}
                {message && <p className="message success-message">{message}</p>}

                <div className='id'>
                    <label htmlFor="name">Username</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your username"
                    />
                </div>

                <div className='id'>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                    />
                </div>

                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default UpdateProfile;
