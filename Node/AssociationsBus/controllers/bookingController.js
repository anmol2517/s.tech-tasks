const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  const booking = await Booking.create(req.body);
  res.json(booking);
};
