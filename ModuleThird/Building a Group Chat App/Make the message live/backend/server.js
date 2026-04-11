import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

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

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chatapp';

const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 }).limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { username, text } = req.body;
    if (!username || !text) {
      return res.status(400).json({ error: 'Username and text are required' });
    }

    const message = new Message({ username, text });
    const savedMessage = await message.save();

    io.emit('newMessage', savedMessage);
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: 'Unable to save message' });
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
