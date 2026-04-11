const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(
      messages.map((message) => ({
        _id: message._id,
        text: message.text,
        senderId: message.senderId,
        createdAt: message.createdAt,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to load messages.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { text, senderId } = req.body;
    if (!text || !senderId) {
      return res.status(400).json({ message: 'Text and senderId are required.' });
    }

    const message = new Message({ text, senderId });
    const saved = await message.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not save message.' });
  }
});

module.exports = router;
