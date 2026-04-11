const { Schema, model } = require('mongoose');

const chatSchema = new Schema({
  sender: { type: String, required: true, trim: true, maxlength: 50 },
  message: { type: String, required: true, trim: true, maxlength: 1000 },
  room: { type: String, required: true, default: 'global' },
  createdAt: { type: Date, required: true, default: () => new Date() }
});

module.exports = model('Chat', chatSchema);
