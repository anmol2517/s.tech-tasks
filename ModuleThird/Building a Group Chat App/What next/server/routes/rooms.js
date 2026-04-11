const express = require('express');
const Message = require('../models/Message');
const { getRooms, addRoom } = require('../data/roomStore');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({ rooms: getRooms() });
});

router.post('/', (req, res) => {
  const { room } = req.body;
  if (!room || typeof room !== 'string') {
    return res.status(400).json({ message: 'Room name is required.' });
  }

  rooms.add(room.trim());
  res.status(201).json({ room: room.trim() });
});

router.get('/:room/messages', async (req, res) => {
  const room = req.params.room;
  if (!room) {
    return res.status(400).json({ message: 'Room name is required.' });
  }

  const messages = await Message.find({ room }).sort({ createdAt: 1 }).limit(200);
  res.json(messages);
});

module.exports = router;
