const express = require('express');
const Chat = require('../models/Chat');
const ArchivedChat = require('../models/ArchivedChat');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find({ room: 'global' })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    return res.json(chats.reverse());
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to load chat messages' });
  }
});

router.post('/', async (req, res) => {
  const { sender, message } = req.body;
  if (!sender || !message) {
    return res.status(400).json({ message: 'Sender and message are required' });
  }
  try {
    const chat = await Chat.create({ sender, message, room: 'global' });
    return res.status(201).json(chat);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to send message' });
  }
});

router.get('/archived', async (req, res) => {
  try {
    const archived = await ArchivedChat.find({})
      .sort({ archivedAt: -1 })
      .limit(100)
      .lean();
    return res.json(archived);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to load archived chats' });
  }
});

module.exports = router;
