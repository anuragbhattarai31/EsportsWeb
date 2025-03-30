const pool = require('../db');



// Get all devices
const getAllDevices = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM devices ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new device
const createDevice = async (req, res) => {
  const { name, type, specs } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO devices (name, type, specs)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, type, specs]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const {rows} = await pool.query(`
      SELECT b.*, u.email, d.name as device_name 
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN devices d ON b.device_id = d.id
      WHERE b.end_time > NOW()  
      ORDER BY b.start_time DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    
    res.status(500).json({ 
      error: 'Failed to fetch bookings',
      details: err.message 
    });
  }
};

const cancelAnyBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM bookings WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking cancelled', booking: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add to adminController.js
const getStats = async (req, res) => {
  try {
    // Total Users
    const usersResult = await pool.query('SELECT COUNT(*) FROM users');
    const totalUsers = parseInt(usersResult.rows[0].count);

    // Active Reservations 
    const activeBookingsResult = await pool.query(
      `SELECT COUNT(*) FROM bookings
       WHERE status = $1
       AND end_time > NOW()`
      ,['reserved']
    );
    const activeReservations = parseInt(activeBookingsResult.rows[0].count);

    // Pending Requests 
    const pendingRequestsResult = await pool.query(
      'SELECT COUNT(*) FROM bookings WHERE status = $1',
      ['pending']
    );
    const pendingRequests = parseInt(pendingRequestsResult.rows[0].count);

    res.json({ totalUsers, activeReservations, pendingRequests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add to adminController.js
const toggleDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE devices SET is_active = NOT is_active WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update device details
const updateDevice = async (req, res) => {
  const { id } = req.params;
  const { name, type, specs } = req.body;
  try {
    const result = await pool.query(
      'UPDATE devices SET name = $1, type = $2, specs = $3 WHERE id = $4 RETURNING *',
      [name, type, specs, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Device not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete device
const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM devices WHERE id = $1 RETURNING *', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Device not found" });
    }
    
    res.json({ message: "Device deleted", device: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update exports at the bottom
module.exports = {
  getAllDevices,
  createDevice,
  getAllBookings,
  cancelAnyBooking,
  getStats,          // Added
  toggleDevice,
  updateDevice,
  deleteDevice      
};