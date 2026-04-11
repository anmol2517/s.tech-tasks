const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const PORT = Number(process.env.PORT || 4000);
const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

if (!BUCKET_NAME || !AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  console.error('Missing required AWS environment variables. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, and S3_BUCKET_NAME.');
  process.exit(1);
}

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const upload = multer({ storage: multer.memoryStorage() });

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    const joinMessage = {
      sender: 'System',
      text: `${username} joined the room.`,
      room,
      createdAt: new Date().toISOString(),
      type: 'system',
    };
    socket.to(room).emit('message', joinMessage);
  });

  socket.on('sendMessage', ({ username, room, text }) => {
    const message = {
      sender: username,
      text,
      room,
      createdAt: new Date().toISOString(),
      type: 'text',
    };
    io.to(room).emit('message', message);
  });

  socket.on('disconnecting', () => {
    const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
    rooms.forEach((room) => {
      const leaveMessage = {
        sender: 'System',
        text: 'A user left the room.',
        room,
        createdAt: new Date().toISOString(),
        type: 'system',
      };
      socket.to(room).emit('message', leaveMessage);
    });
  });
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  const { room, username } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  if (!room || !username) {
    return res.status(400).json({ error: 'Missing room or username' });
  }

  const extension = path.extname(file.originalname);
  const randomBytes = crypto.randomBytes(16).toString('hex');
  const key = `media/${Date.now()}-${randomBytes}${extension}`;

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });
    await s3Client.send(command);

    const fileUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;

    const mediaMessage = {
      sender: username,
      room,
      url: fileUrl,
      filename: file.originalname,
      fileType: file.mimetype,
      createdAt: new Date().toISOString(),
      type: 'media',
    };

    io.to(room).emit('message', mediaMessage);

    return res.status(200).json({ url: fileUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload file to S3' });
  }
});

app.get('/', (req, res) => {
  res.send({ status: 'Group chat backend running' });
});

server.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});
