const pool = require('../db');

// Create new booking
const createBooking = async (userId, deviceId, startTime, endTime) => {
  const result = await pool.query(
    `INSERT INTO bookings (user_id, device_id, start_time, end_time)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, deviceId, startTime, endTime]
  );
  return result.rows[0];
};

// Get user's bookings
const getUserBookings = async (userId) => {
  const result = await pool.query(`
    SELECT b.*, d.name, d.type 
    FROM bookings b
    JOIN devices d ON b.device_id = d.id
    WHERE user_id = $1
  `, [userId]);
  return result.rows;
};

module.exports = { createBooking, getUserBookings };