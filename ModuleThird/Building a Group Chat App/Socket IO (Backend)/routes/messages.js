const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get latest 50 messages
router.get('/', async (req, res) => {
  try {
    const room = req.query.room || 'global';
    const messages = await Message.find({ room })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a message manually via REST
router.post('/', async (req, res) => {
  try {
    const { sender, text, room = 'global' } = req.body;
    const message = new Message({ sender, text, room });
    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error saving message:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
