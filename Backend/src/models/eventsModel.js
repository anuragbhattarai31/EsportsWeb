// models/eventsModel.js
const pool = require('../db');

const createEvent = async (title, date, location, description) => {
  const result = await pool.query(
    `INSERT INTO events (title, date, location, description)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, date, location, description]
  );
  return result.rows[0];
};

const getAllEvents = async () => {
  const result = await pool.query(
    `SELECT * FROM events ORDER BY date ASC`
  );
  return result.rows;
};

const deleteEvent = async (id) => {
  await pool.query('DELETE FROM events WHERE id = $1', [id]);
};

module.exports = { createEvent, getAllEvents, deleteEvent };