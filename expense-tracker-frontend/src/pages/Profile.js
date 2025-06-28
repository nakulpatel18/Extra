// -- expense-tracker-frontend\src\pages\Profile.js --

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api'; // Your custom axios instance
import '../pages/Login.css'; // Reusing some general form styles

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const res = await api.get('/users/profile'); // Fetch profile from backend
                setUser(res.data);
                setError('');
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError(err.response?.data?.message || 'Failed to load profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return <div className="login-container">Loading profile...</div>;
    }

    if (error) {
        return <div className="login-container"><p className="message error-message">{error}</p></div>;
    }

    if (!user) {
        return <div className="login-container">User profile not found.</div>;
    }

    return (
        <div className="login-container"> {/* Reusing login container for centering */}
            <div className="login-form"> {/* Reusing login form card styling */}
                <h2>Your Profile</h2>
                <p><strong>Username:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                {/* You can add more profile details here if you expand the user model */}

                <div style={{ marginTop: '1.5rem' }}>
                    <Link to="/profile/update" className="login-form button" style={{ display: 'block', textDecoration: 'none', marginBottom: '1rem' }}>
                        Update Details
                    </Link>
                    <Link to="/profile/change-password" className="login-form button" style={{ display: 'block', textDecoration: 'none' }}>
                        Change Password
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Profile;
