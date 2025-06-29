// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//     const token = req.headers.authorization?.replace("Bearer ", "");

//     if (!token) {
//         return res.status(401).json({ error: 'No token provided, authorization denied' });
//     }

//     try {
//         const verified = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = verified;
//         next();
//     } catch (err) {
//         res.status(400).json({ error: 'Invalid token' });
//     }
// };

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // FIX: Assign the nested 'user' object from the token payload to req.user
        req.user = verified.user; // Now req.user will be { id: ..., role: ... }
        console.log("DEBUG: auth.middleware.js - req.user after verification (FIXED):", req.user);
        next();
    } catch (err) {
        console.error("DEBUG: auth.middleware.js - Token verification failed:", err.message);
        res.status(400).json({ error: 'Invalid token' });
    }
};