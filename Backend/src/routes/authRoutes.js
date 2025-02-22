
// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, dashboard, adminDashboard } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');




const router = express.Router();

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

// Protected Dashboard Route
router.get('/dashboard', authenticateToken, dashboard);

router.get('/adminDashboard', authenticateToken, adminDashboard );

module.exports = router;
