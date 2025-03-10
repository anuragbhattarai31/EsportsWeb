const { getAvailableDevices } = require('../models/deviceModel');
const { createBooking, getUserBookings } = require('../models/bookingModel');
const pool = require('../db');

// Check available devices
const checkAvailability = async (req, res) => {
    try {
        if (!req.body || !req.body.start_time || !req.body.end_time) {
            return res.status(400).json({ 
              error: "Missing required fields: start_time and end_time" 
            });
          }

    
      const { start_time, end_time } = req.body;
      
      // Validate input
      if (!start_time || !end_time) {
        return res.status(400).json({ error: "Start and end times required" });
      }
  
      // Convert to Date objects with validation
      const startDate = new Date(start_time);
      const endDate = new Date(end_time);
      if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).json({ error: "Invalid date format" });
      }
  
      // Get available devices with error handling
      const devices = await getAvailableDevices(startDate, endDate)
        .catch(err => {
          console.error("Database error:", err);
          throw new Error("Failed to query database");
        });
  
      res.json({ available_devices: devices });
      
    } catch (err) {
      console.error("Availability check error:", err);
      res.status(500).json({ 
        error: "Availability check failed",
        details: err.message 
      });
    }
  };

// Corrected createBookingHandler with proper async handling
const createBookingHandler = async (req, res) => {
  try {
    const { device_id, start_time, end_time } = req.body;
    const userId = req.user.id;

    // Validate device exists and is active
    const device = await pool.query(
      "SELECT * FROM devices WHERE id = $1 AND is_active = TRUE",
      [device_id]
    );

    if (device.rows.length === 0) {
      return res.status(400).json({ error: "Invalid device or device not available" });
    }

   // time validation
    const nowUTC = new Date().toISOString();
    if (new Date(start_time) < new Date(nowUTC)) {
      return res.status(400).json({ error: "Cannot book in the past" });
    } 

    // In createBookingHandler, after device validation
    if (new Date(start_time) >= new Date(end_time)) {
      return res.status(400).json({ error: "End time must be after start time" });
    }

    // Validate max duration (2 hours)
    const durationHours = (new Date(end_time) - new Date(start_time)) / (1000 * 60 * 60);
    if (durationHours > 2) {
      return res.status(400).json({ error: "Max booking duration is 2 hours" });
    }


    const existingBooking = await pool.query(
      `SELECT id FROM bookings 
       WHERE device_id = $1 
      AND status = 'reserved'
      AND (start_time, end_time) OVERLAPS ($2::timestamptz, $3::timestamptz)`,
    [device_id,
    new Date(start_time).toISOString(),
    new Date(end_time).toISOString()]  // Use ISO strings directly
    );

    if (existingBooking.rows.length > 0) {
      return res.status(400).json({ error: "Device already booked for this period" });
    }

    // Create booking
    const booking = await createBooking(userId, device_id, start_time, end_time);
    res.status(201).json(booking);

  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ 
      error: "Booking failed",
      details: err.message 
    });
  }
};

// Get user bookings
const getUserBookingsHandler = async (req, res) => {
  try {
    const bookings = await getUserBookings(req.user.id);
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve bookings" });
  }
};


// Add to bookingController.js
const cancelBookingHandler = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    // Verify booking ownership
    const booking = await pool.query(
      `SELECT * FROM bookings 
       WHERE id = $1 AND user_id = $2`,
      [bookingId, userId]
    );

    if (booking.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Delete or mark as cancelled
    await pool.query(
      `DELETE FROM bookings 
       WHERE id = $1 AND user_id = $2`,
      [bookingId, userId]
    );

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};

module.exports = { checkAvailability, createBooking: createBookingHandler, getUserBookings: getUserBookingsHandler, cancelBookingHandler };