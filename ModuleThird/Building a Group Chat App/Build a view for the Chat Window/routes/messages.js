const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 }).limit(200);
    res.json(messages);
  } catch (error) {
    console.error('Error loading messages:', error);
    res.status(500).json({ error: 'Unable to load messages' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user, text } = req.body;
    if (!user || !text) {
      return res.status(400).json({ error: 'User and text are required' });
    }

    const newMessage = new Message({ user, text });
    const savedMessage = await newMessage.save();

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Unable to save message' });
  }
});

module.exports = router;
