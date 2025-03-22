const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middleware/authMiddleware');
const { submitRegistration, getPendingRequests, updateRequestStatus,getRegistrationStatus,getApprovedMembers } = require('../controllers/clubRegistrationController');

// User routes
router.post('/', authenticateToken, submitRegistration)
router.get('/',authenticateToken,getRegistrationStatus);

// Admin routes
router.get('/admin/pending', authenticateToken, getPendingRequests);
router.put('/admin/:id', authenticateToken, updateRequestStatus);
router.get('/admin/approved', authenticateToken, getApprovedMembers);
module.exports = router;