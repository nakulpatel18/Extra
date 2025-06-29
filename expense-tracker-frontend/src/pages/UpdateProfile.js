import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../pages/ProfileAuthForms.css';

const UpdateProfile = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
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
            setTimeout(() => {
                navigate('/profile');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
            console.error('Update profile error:', err.response ? err.response.data : err.message);
        }
    };

    return (
        <div className="form-container-wrapper">
            <form onSubmit={handleSubmit} className="auth-form-card">
                <h2>Update Profile Details</h2>

                {error && <p className="message error-message">{error}</p>}
                {message && <p className="message">{message}</p>}

                <div className='form-group'>
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

                <div className='form-group'> 
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
