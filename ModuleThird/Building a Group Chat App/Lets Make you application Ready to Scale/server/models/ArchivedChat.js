const { Schema, model } = require('mongoose');

const archivedChatSchema = new Schema({
  sender: { type: String, required: true, trim: true, maxlength: 50 },
  message: { type: String, required: true, trim: true, maxlength: 1000 },
  room: { type: String, required: true, default: 'global' },
  archivedAt: { type: Date, required: true, default: () => new Date() },
  originalCreatedAt: { type: Date, required: true }
});

module.exports = model('ArchivedChat', archivedChatSchema);
