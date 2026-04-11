const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const authRoutes = require('../routes/auth');
const { socketAuth } = require('./middleware');
const chatHandler = require('./handlers/chat');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const onlineUsers = new Map();

io.use(socketAuth);

io.on('connection', (socket) => {
  const { userId, name } = socket.user;
  onlineUsers.set(userId, socket.id);

  socket.join('global-room');
  socket.broadcast.emit('userConnected', { userId, name });

  chatHandler(io, socket, onlineUsers);

  socket.on('disconnect', () => {
    onlineUsers.delete(userId);
    io.emit('userDisconnected', { userId, name });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
