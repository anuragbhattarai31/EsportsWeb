const pool = require('../db');

const createNews = async (title, excerpt, content, imageUrl) => {
  const result = await pool.query(
    `INSERT INTO news (title, excerpt, content, image_url)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, excerpt, content, imageUrl]
  );
  return result.rows[0];
};

const getAllNews = async () => {
  const result = await pool.query(
    `SELECT * FROM news ORDER BY created_at DESC`
  );
  return result.rows;
};

// newsModel.js
const deleteNews = async (id) => {
  await pool.query('DELETE FROM news WHERE id = $1', [id]);
};



module.exports = { createNews, getAllNews, deleteNews };