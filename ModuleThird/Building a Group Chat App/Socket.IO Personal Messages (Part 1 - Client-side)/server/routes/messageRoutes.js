const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await Message.find({ roomId }).sort({ timestamp: 1 }).lean();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch messages' });
  }
});

module.exports = router;
