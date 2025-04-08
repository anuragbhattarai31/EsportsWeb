// routes/eventsRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const { createEvent, getAllEvents, deleteEvent } = require('../models/eventsModel');

// Create new event
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { title, date, location, description } = req.body;
    const event = await createEvent(title, date, location, description);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await getAllEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete event
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await deleteEvent(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;