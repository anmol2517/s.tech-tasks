const Message = require('../models/Message');

function handlePersonalChat(io, socket) {
  socket.on('join_room', async ({ roomId, username }) => {
    if (!roomId) return;
    socket.join(roomId);
    socket.emit('joined_room', { roomId });
    console.log(`${username || socket.id} joined room ${roomId}`);
  });

  socket.on('new_message', async (data) => {
    const { roomId, sender, receiver, content, timestamp } = data;
    if (!roomId || !sender || !receiver || !content) return;

    try {
      const message = await Message.create({
        roomId,
        sender,
        receiver,
        content,
        timestamp: timestamp ? new Date(timestamp) : new Date()
      });

      const payload = {
        _id: message._id,
        roomId: message.roomId,
        sender: message.sender,
        receiver: message.receiver,
        content: message.content,
        timestamp: message.timestamp
      };

      io.to(roomId).emit('receive_message', payload);
      console.log(`Message from ${sender} to ${receiver} in ${roomId}`);
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('message_error', { message: 'Unable to save message' });
    }
  });
}

module.exports = handlePersonalChat;
