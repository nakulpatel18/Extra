// expense-tracker-frontend\src\api\api.js
import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Adjust this if your backend is on a different URL
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;