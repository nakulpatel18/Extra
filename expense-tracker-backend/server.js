// -- expense-tracker-backend\server.js --

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Make sure this is at the very top
const expenseRoutes = require('./routes/expenses');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Import the admin routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Use application routes
app.use('/api/expenses', expenseRoutes); // User-specific expense routes
app.use('/api/auth', authRoutes);       // Authentication routes (login, register, forgot/reset password)
app.use('/api/admin', adminRoutes);     // IMPORTANT: Mount the admin routes here

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});