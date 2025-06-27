// -- expense-tracker-backend\middlewares\adminAuth.middleware.js --

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Re-using the logic from auth.middleware.js to get the user from token
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // This object contains { id: user._id, role: user.role }

        // Check if the authenticated user has the 'admin' role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied: Admin privileges required.' });
        }
        next(); // User is an admin, proceed
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};