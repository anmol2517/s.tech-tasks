const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const messageRoutes = require('./routes/messages');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST'],
}));
app.use(express.json());
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('Socket.IO Backend for Group Chat is running');
});

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinRoom', ({ username, room }) => {
    const roomName = room || 'global';
    socket.join(roomName);
    socket.to(roomName).emit('notification', {
      sender: 'System',
      text: `${username || 'A user'} has joined the room.`,
      room: roomName,
    });
  });

  socket.on('sendMessage', async (payload) => {
    try {
      const { sender, text, room = 'global' } = payload;
      const Message = require('./models/Message');
      const message = new Message({ sender, text, room });
      const savedMessage = await message.save();

      io.to(room).emit('receiveMessage', savedMessage);
    } catch (error) {
      console.error('Error saving message:', error.message);
      socket.emit('errorMessage', { message: 'Unable to send message.' });
    }
  });

  socket.on('typing', ({ username, room = 'global' }) => {
    socket.to(room).emit('typing', { username });
  });

  socket.on('stopTyping', ({ username, room = 'global' }) => {
    socket.to(room).emit('stopTyping', { username });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
