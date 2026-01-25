const User = require('../models/User');

exports.createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
};

exports.getUserBookings = async (req, res) => {
  const user = await User.findByPk(req.params.id, { include: 'Bookings' });
  res.json(user.Bookings);
};
