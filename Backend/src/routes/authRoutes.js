
// routes/authRoutes.js
const pool = require('../db');
const express = require('express');
const { registerUser, loginUser, dashboard, adminDashboard } = require('../controllers/authController');
const {authenticateToken} = require('../middleware/authMiddleware');
const router = express.Router();

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

// Protected Dashboard Route
router.get('/dashboard', authenticateToken, dashboard);

router.get('/adminDashboard', authenticateToken, adminDashboard );
// Add to your authRoutes.js
router.get('/user', authenticateToken, async (req, res) => {
    try {
      const user = await pool.query(
        'SELECT id, username, email, role FROM users WHERE id = $1',
        [req.user.id]
      );
      
      if (user.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;

