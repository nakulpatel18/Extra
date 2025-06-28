// -- expense-tracker-frontend\src\pages\Profile.js --

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api'; // Your custom axios instance
import '../pages/ProfileAuthForms.css'; // Import from NEW combined CSS

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
        return <div className="form-container-wrapper">Loading profile...</div>;
    }

    if (error) {
        return <div className="form-container-wrapper"><p className="message error-message">{error}</p></div>;
    }

    if (!user) {
        return <div className="form-container-wrapper">User profile not found.</div>;
    }

    return (
        <div className="form-container-wrapper"> {/* Uses common wrapper class */}
            <div className="auth-form-card"> {/* Uses common form card class */}
                <h2>Your Profile</h2>
                <div className="profile-details">
                    <p><strong>Username:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
                

                <div className="profile-actions"> {/* Uses common profile-actions class */}
                    <Link to="/profile/update" className="profile-action-button">
                        Update Details
                    </Link>
                    <Link to="/profile/change-password" className="profile-action-button">
                        Change Password
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Profile;
