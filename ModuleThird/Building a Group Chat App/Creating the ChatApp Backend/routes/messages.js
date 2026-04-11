const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

router.post('/', async (req, res) => {
  const { userId, text } = req.body;

  if (!userId || !text) {
    return res.status(400).json({ message: 'userId and text are required' });
  }

  try {
    const newMessage = new Message({ userId, text });
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save message' });
  }
});

module.exports = router;
