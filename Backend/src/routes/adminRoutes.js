const express = require('express');
const router = express.Router();
const { 
  getAllDevices,
  createDevice,
  updateDevice,
  deleteDevice,
  getAllBookings,
  cancelAnyBooking,
  getStats,
  toggleDevice
} = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// Device Management
router.get('/devices', authenticateToken, isAdmin, getAllDevices);
router.post('/devices', authenticateToken, isAdmin, createDevice);
router.put('/devices/:id', authenticateToken, isAdmin, updateDevice);
router.delete('/devices/:id', authenticateToken, isAdmin, deleteDevice);

// Booking Management
router.get('/bookings', authenticateToken, isAdmin, getAllBookings);
router.put('/bookings/:id/cancel', authenticateToken, isAdmin, cancelAnyBooking);

router.get('/stats', authenticateToken, isAdmin, getStats);
router.put('/devices/:id/toggle', authenticateToken, isAdmin, toggleDevice);

module.exports = router;