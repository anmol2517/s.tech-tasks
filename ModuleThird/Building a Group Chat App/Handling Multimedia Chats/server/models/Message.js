const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  text: { type: String },
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'file'],
    required: true,
    default: 'text',
  },
  url: { type: String },
  filename: { type: String },
  mimetype: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', MessageSchema);
