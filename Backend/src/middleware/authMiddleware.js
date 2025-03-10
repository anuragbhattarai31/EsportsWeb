// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try{
         const user = jwt.verify(token, process.env.JWT_SECRET);
         req.user = user;
         next();
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    };
}

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  };

module.exports = {authenticateToken, isAdmin};
