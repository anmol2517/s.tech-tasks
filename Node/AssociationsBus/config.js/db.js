const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'bus_booking_assoc_db',
  'root',
  'your_pass',
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);

module.exports = sequelize;
