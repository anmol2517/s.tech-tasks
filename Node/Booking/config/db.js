const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'booking_app',
  'root',
  'your_pass',
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);

module.exports = sequelize;
