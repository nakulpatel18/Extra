// -- expense-tracker-frontend\src\pages\Register.js --

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import './Register.css';
import { Link } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const Register = ({ setIsLoggedIn, setUserRole, onSuccess, switchToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        if (formData.password.length < 6) {
            setMessage('Password must be at least 6 characters long.');
            return;
        }

        try {
            const { name, email, password } = formData;
            const res = await api.post('/auth/register', { name, email, password });
            setMessage('Registration successful!');

            if (res.status === 200) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userRole', res.data.data.role);
                localStorage.setItem('userId', res.data.data.id);

                setIsLoggedIn(true);
                setUserRole(res.data.data.role);

                if (onSuccess) {
                    onSuccess(); // close modal + redirect
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            setMessage(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>Register</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <div className="input-with-icon">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <MdVisibility size={22} /> : <MdVisibilityOff size={22} />}
                    </span>
                </div>

                <div className="input-with-icon">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <span className="toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <MdVisibility size={22} /> : <MdVisibilityOff size={22} />}
                    </span>
                </div>

                <button type="submit">Register</button>

                <p className="footer">
                    Already have an account?{' '}
                    <span
                        style={{ color: 'skyblue', cursor: 'pointer' }}
                        onClick={switchToLogin}
                    >
                        Login
                    </span>
                </p>

                {message && <p className="message">{message}</p>}
            </form>
        </div>
    );
};

export default Register;
