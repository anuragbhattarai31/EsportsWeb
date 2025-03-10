const pool = require('../db');

const getAvailableDevices = async (startTime, endTime) => {
  try {
    const result = await pool.query(
      `SELECT * FROM devices 
       WHERE id NOT IN (
         SELECT device_id FROM bookings 
         WHERE (start_time, end_time) OVERLAPS ($1::timestamptz, $2::timestamptz)
         AND status != 'cancelled'
       )
       AND is_active = TRUE
       ORDER BY id ASC`,
      [startTime, endTime]
    );
    return result.rows;
  } catch (err) {
    throw new Error(`Failed to query database: ${err.message}`);
  }
};

module.exports = { getAvailableDevices };