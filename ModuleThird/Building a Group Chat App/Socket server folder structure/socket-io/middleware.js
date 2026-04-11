const jwt = require('jsonwebtoken');
const User = require('../models/User');

const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) {
      const error = new Error('Authentication error');
      error.data = { message: 'Token required' };
      return next(error);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      const error = new Error('Authentication error');
      error.data = { message: 'Invalid user' };
      return next(error);
    }

    socket.user = { userId: user._id.toString(), name: user.name, email: user.email };
    next();
  } catch (err) {
    const error = new Error('Authentication error');
    error.data = { message: err.message };
    next(error);
  }
};

module.exports = {
  socketAuth
};
