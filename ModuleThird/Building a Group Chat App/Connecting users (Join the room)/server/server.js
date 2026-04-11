const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern_chat';
const port = process.env.PORT || 5000;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const generateRoomId = (emailA, emailB) => {
  const normalizedA = (emailA || '').trim().toLowerCase();
  const normalizedB = (emailB || '').trim().toLowerCase();
  return [normalizedA, normalizedB].sort().join('_');
};

app.get('/api/users/exists', async (req, res) => {
  try {
    const email = (req.query.email || '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ exists: false, message: 'Email query is required' });
    }
    const user = await User.findOne({ email });
    return res.json({ exists: Boolean(user) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ exists: false, error: 'Server error' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('name email -_id');
    return res.json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/room-id', (req, res) => {
  const { emailA, emailB } = req.body;
  if (!emailA || !emailB) {
    return res.status(400).json({ error: 'Both emails are required' });
  }
  const roomId = generateRoomId(emailA, emailB);
  return res.json({ roomId });
});

io.on('connection', socket => {
  console.log('Socket connected:', socket.id);

  socket.on('join_room', ({ roomId, email }) => {
    if (!roomId || !email) return;
    socket.join(roomId);
    console.log(`${email} joined room ${roomId}`);
    socket.to(roomId).emit('user_joined', { roomId, email });
  });

  socket.on('send_message', ({ roomId, sender, message }) => {
    if (!roomId || !sender || !message) return;
    const payload = {
      sender,
      message,
      timestamp: new Date().toISOString()
    };
    socket.to(roomId).emit('receive_message', payload);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
