require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDatabase = require('./utils/db');
const chatRouter = require('./routes/chat');
const { startArchiver, archiveOldChats } = require('./cron/archiveJobs');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/scale-chat';
const ARCHIVE_CRON = process.env.ARCHIVE_CRON || '0 5 * * *';

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/chats', chatRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/archive/run', async (req, res) => {
  try {
    await archiveOldChats();
    res.json({ message: 'Archive job run successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Archive job failed' });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
  });
}

connectDatabase(MONGODB_URI)
  .then(() => {
    startArchiver(ARCHIVE_CRON);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to database', error);
    process.exit(1);
  });
