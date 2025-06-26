const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.replace("Bearer ","");
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try{
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    }catch{
        res.status(400).json({ error: 'Invalid token' });
    }
};
