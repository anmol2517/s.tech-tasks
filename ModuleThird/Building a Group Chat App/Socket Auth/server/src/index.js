require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const { socketAuth } = require('./middleware/authMiddleware');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Socket Auth Backend is running');
});

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.use(socketAuth);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.name} (${socket.user.email})`);

  socket.emit('welcome', {
    message: `Welcome ${socket.user.name}! You are authenticated on Socket.IO.`,
    user: socket.user,
  });

  socket.on('sendMessage', (message) => {
    const payload = {
      text: message,
      user: {
        id: socket.user._id,
        name: socket.user.name,
      },
      createdAt: new Date(),
    };
    io.emit('message', payload);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.name}`);
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to database:', err);
});
