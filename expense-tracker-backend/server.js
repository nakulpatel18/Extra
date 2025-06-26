const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const expenseRoutes = require('./routes/expenses');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use expense routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', require('./routes/authRoutes'));

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
