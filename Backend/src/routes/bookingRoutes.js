const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../middleware/authMiddleware');
const { checkAvailability, createBooking: createBookingHandler, getUserBookings: getUserBookingsHandler, cancelBookingHandler } = require('../controllers/bookingController');

// Protected routes
router.post('/availability', authenticateToken, checkAvailability);
router.post('/create', authenticateToken, createBookingHandler);
router.get('/my-bookings', authenticateToken, getUserBookingsHandler);
router.delete('/:bookingId', authenticateToken, cancelBookingHandler);

module.exports = router;