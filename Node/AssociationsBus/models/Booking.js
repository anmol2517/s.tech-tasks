const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Bus = require('./Bus');

const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  seatNumber: DataTypes.INTEGER
});

User.hasMany(Booking);
Booking.belongsTo(User);

Bus.hasMany(Booking);
Booking.belongsTo(Bus);

module.exports = Booking;
