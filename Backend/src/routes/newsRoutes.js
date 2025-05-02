const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const { createNews, getAllNews,deleteNews } = require('../models/newsModel');
const upload = require('../middleware/uploadMiddleware'); // Implement file upload middleware
const checkFileExists = require('../middleware/fileCheck'); // Implement file existence check middleware
const path = require('path');
const pool = require('../db'); // Assuming you have a db.js file for database connection

router.post('/', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
      const { title, excerpt, content } = req.body;
      // Use absolute URL
      // Build the public URL based on the actual protocol & host
      const imageUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
     : null;

  
      const news = await createNews(title, excerpt, content, imageUrl);
      res.status(201).json(news);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Public: Get All News
router.get('/', async (req, res) => {
  try {
    const news = await getAllNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add this route
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await deleteNews(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/image/:filename', checkFileExists, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/uploads', req.params.filename));
});


router.get('/:id', async (req, res) => {
  console.log(`Request received for news ID: ${req.params.id}`);
  try {
    const result = await pool.query(
      'SELECT * FROM news WHERE id = $1',
      [req.params.id]
    );
    console.log(`Query results: ${JSON.stringify(result.rows)}`);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'News item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
});





module.exports = router;