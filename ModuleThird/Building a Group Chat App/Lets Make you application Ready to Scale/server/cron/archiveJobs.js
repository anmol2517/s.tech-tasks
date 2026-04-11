const cron = require('node-cron');
const Chat = require('../models/Chat');
const ArchivedChat = require('../models/ArchivedChat');

async function archiveOldChats() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const oldChats = await Chat.find({ createdAt: { $lt: oneDayAgo } }).lean();
  if (!oldChats.length) {
    console.log('🕒 No old chats to archive');
    return;
  }

  const archiveDocs = oldChats.map(chat => ({
    sender: chat.sender,
    message: chat.message,
    room: chat.room,
    originalCreatedAt: chat.createdAt,
    archivedAt: new Date()
  }));

  await ArchivedChat.insertMany(archiveDocs);
  await Chat.deleteMany({ _id: { $in: oldChats.map(chat => chat._id) } });
  console.log(`✅ Archived ${archiveDocs.length} chat messages and cleaned up the Chat collection`);
}

function startArchiver(cronExpression) {
  const expression = cronExpression || '0 5 * * *';
  console.log(`⏳ Scheduling archive job with cron expression: ${expression}`);
  cron.schedule(expression, async () => {
    try {
      console.log('🚀 Running nightly archive job');
      await archiveOldChats();
    } catch (err) {
      console.error('Archive job failed', err);
    }
  });
}

module.exports = { archiveOldChats, startArchiver };
