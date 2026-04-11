const path = require('path');
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const Message = require('./models/Message');
const config = require('./config');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

const s3 = new aws.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: config.aws.bucketName,
    acl: 'public-read',
    key(req, file, cb) {
      const timestamp = Date.now();
      const safeName = `${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.-_]/g, '_')}`;
      cb(null, safeName);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 },
});

function getFileType(mimetype) {
  if (!mimetype) return 'file';
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'audio';
  return 'file';
}

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file || !req.file.location) {
    return res.status(400).json({ error: 'File upload failed.' });
  }

  const fileType = getFileType(req.file.mimetype);
  res.json({
    url: req.file.location,
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    type: fileType,
  });
});

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 }).limit(200);
    res.json(messages);
  } catch (error) {
    console.error('Failed to load messages:', error);
    res.status(500).json({ error: 'Unable to fetch messages.' });
  }
});

io.on('connection', async (socket) => {
  console.log('New connection:', socket.id);

  try {
    const messages = await Message.find().sort({ createdAt: 1 }).limit(200);
    socket.emit('chatHistory', messages);
  } catch (error) {
    console.error('Error fetching history:', error);
  }

  socket.on('sendMessage', async (payload) => {
    try {
      const message = new Message(payload);
      await message.save();
      io.emit('message', message);
    } catch (error) {
      console.error('Message save failed:', error);
      socket.emit('sendError', { error: 'Unable to save message.' });
    }
  });
});

async function start() {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }

  server.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
}

start();
