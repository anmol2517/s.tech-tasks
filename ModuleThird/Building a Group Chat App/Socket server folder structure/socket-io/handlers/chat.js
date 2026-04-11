const Message = require('../../models/Message');

module.exports = (io, socket, onlineUsers) => {
  socket.on('sendMessage', async (payload) => {
    const { text, room = 'global-room', toUserId } = payload;

    const message = await Message.create({
      sender: socket.user.userId,
      senderName: socket.user.name,
      room,
      text,
      recipient: toUserId || null
    });

    const eventPayload = {
      _id: message._id,
      text: message.text,
      sender: message.sender,
      senderName: message.senderName,
      room: message.room,
      recipient: message.recipient,
      createdAt: message.createdAt
    };

    if (toUserId && onlineUsers.has(toUserId)) {
      const targetSocket = onlineUsers.get(toUserId);
      socket.to(targetSocket).emit('privateMessage', eventPayload);
      socket.emit('privateMessage', eventPayload);
      return;
    }

    io.to(room).emit('newMessage', eventPayload);
  });

  socket.on('joinRoom', (room) => {
    const normalizedRoom = room || 'global-room';
    socket.join(normalizedRoom);
    socket.emit('joinedRoom', normalizedRoom);
  });

  socket.on('typing', (room) => {
    const normalizedRoom = room || 'global-room';
    socket.to(normalizedRoom).emit('userTyping', {
      userId: socket.user.userId,
      name: socket.user.name,
      room: normalizedRoom
    });
  });

  socket.on('loadRecentMessages', async (room = 'global-room') => {
    const messages = await Message.find({ room })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    socket.emit('recentMessages', messages.reverse());
  });
};
