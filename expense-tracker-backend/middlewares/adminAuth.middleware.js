const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = verified.user; 
        console.log("DEBUG: adminAuth.middleware.js - req.user after verification (FIXED):", req.user);
        console.log("DEBUG: adminAuth.middleware.js - User role (FIXED):", req.user.role);

        // Check if the authenticated user has the 'admin' role
        if (req.user.role !== 'admin') {
            console.warn("DEBUG: adminAuth.middleware.js - Access denied: User is not admin. Role (FIXED):", req.user.role);
            return res.status(403).json({ error: 'Access denied: Admin privileges required.' });
        }
        next(); // User is an admin, proceed
    } catch (err) {
        console.error("DEBUG: adminAuth.middleware.js - Token verification failed:", err.message);
        res.status(400).json({ error: 'Invalid token' });
    }
};
