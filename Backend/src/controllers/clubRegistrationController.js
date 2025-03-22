
const pool = require('../db');
const { createRegistration, getPendingRegistrations, updateRegistrationStatus } = require('../models/clubRegistrationModel');

const getApprovedMembers = async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT cr.*, u.email 
         FROM club_registrations cr
         JOIN users u ON cr.user_id = u.id
         WHERE cr.status = 'approved'`
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch members' });
    }
  };

const getRegistrationStatus = async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT status FROM club_registrations WHERE user_id = $1',
        [req.user.id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'No registration found' });
      }
  
      res.json({ status: result.rows[0].status });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ 
        error: "Failed to check registration status",
        details: error.message 
      });
    }
  };
  
 

const submitRegistration = async (req, res) => {
  try {
    const { fullName, semoId } = req.body;
    const registration = await createRegistration(req.user.id, fullName, semoId);
    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ error: 'Registration submission failed' });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const requests = await getPendingRegistrations();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

     // Add validation
     if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

    const updated = await updateRegistrationStatus(id, status);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Status update failed' });
  }
};

module.exports = {
  submitRegistration,
  getPendingRequests,
  updateRequestStatus,
  getRegistrationStatus,
    getApprovedMembers
};