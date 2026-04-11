require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const Message = require('./models/Message');
const roomRouter = require('./routes/rooms');
const { addRoom } = require('./data/roomStore');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use('/api/rooms', roomRouter);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern-group-chat';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('joinRoom', async ({ room, author }, callback) => {
    if (!room || !author) {
      return callback({ status: 'error', message: 'Room and author are required.' });
    }

    socket.join(room);
    addRoom(room);

    const recentMessages = await Message.find({ room }).sort({ createdAt: 1 }).limit(200);
    socket.emit('roomHistory', recentMessages);

    socket.to(room).emit('systemMessage', {
      room,
      text: `${author} joined the chat.`,
      createdAt: new Date()
    });

    callback({ status: 'ok', room });
  });

  socket.on('leaveRoom', ({ room, author }) => {
    if (!room) return;
    socket.leave(room);
    socket.to(room).emit('systemMessage', {
      room,
      text: `${author || 'A user'} left the chat.`,
      createdAt: new Date()
    });
  });

  socket.on('sendMessage', async ({ room, author, text }, callback) => {
    if (!room || !author || !text) {
      return callback({ status: 'error', message: 'Room, author, and text are required.' });
    }

    const message = new Message({ room, author, text });
    await message.save();

    io.to(room).emit('newMessage', message);
    callback({ status: 'ok' });
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const portCandidates = [PORT, 4001, 4002];

function startServer(index = 0) {
  const selectedPort = portCandidates[index];

  server.listen(selectedPort, () => {
    console.log(`Server running on http://localhost:${selectedPort}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE' && index < portCandidates.length - 1) {
      console.warn(`Port ${selectedPort} is in use. Trying port ${portCandidates[index + 1]}...`);
      startServer(index + 1);
    } else {
      console.error('Server failed to start:', err.message);
      process.exit(1);
    }
  });
}

startServer();
