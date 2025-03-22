const pool = require('../db');

const createRegistration = async (userId, fullName, semoId) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Check for existing registration
      const existing = await client.query(
        'SELECT id FROM club_registrations WHERE user_id = $1',
        [userId]
      );
      
      if (existing.rows.length > 0) {
        throw new Error('User already has a registration');
      }
  
      const result = await client.query(
        `INSERT INTO club_registrations 
          (user_id, full_name, semo_id)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, fullName, semoId]
      );
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  };

const getPendingRegistrations = async () => {
  const result = await pool.query(
    `SELECT cr.*, u.email 
     FROM club_registrations cr
     JOIN users u ON cr.user_id = u.id
     WHERE cr.status = 'pending'`
  );
  return result.rows;
};

const updateRegistrationStatus = async (id, status) => {
  try{
  const result = await pool.query(
    `UPDATE club_registrations 
     SET status = $1, updated_at = NOW()
     WHERE id = $2 RETURNING *`,
    [status, id]
  );
  if (result.rowCount === 0) {
    throw new Error('Registration not found');
  }
    return result.rows[0];
  } catch(error) {
    console.error('Database update error:', error);
    throw error; // Propagate error to controller
  }
}
  


module.exports = {
  createRegistration,
  getPendingRegistrations,
  updateRegistrationStatus
};