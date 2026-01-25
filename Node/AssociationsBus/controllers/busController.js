const Bus = require('../models/Bus');

exports.createBus = async (req, res) => {
  const bus = await Bus.create(req.body);
  res.json(bus);
};

exports.getBusBookings = async (req, res) => {
  const bus = await Bus.findByPk(req.params.id, { include: 'Bookings' });
  res.json(bus.Bookings);
};
