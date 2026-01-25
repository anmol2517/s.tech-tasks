const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Bus = sequelize.define('Bus', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  busNumber: DataTypes.STRING,
  totalSeats: DataTypes.INTEGER,
  availableSeats: DataTypes.INTEGER
});

module.exports = Bus;
