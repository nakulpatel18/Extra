// -- expense-tracker-backend\middlewares\auth.middleware.js --

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get the token from the header (it comes as 'Bearer <token>')
    const token = req.headers.authorization?.replace("Bearer ","");
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    try{
        // Verify the token using your secret
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // Extract the user's ID and role from the decoded token payload
        // The payload you created is { id: user._id, role: user.role }
        req.user = verified; // This object will contain { id, role }
        
        next(); // Proceed to the next middleware or route handler
    }catch(err){
        // If verification fails, the token is invalid
        res.status(400).json({ error: 'Invalid token' });
    }
};
