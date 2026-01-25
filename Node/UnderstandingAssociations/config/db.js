const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'sequelize_m2m_db',
  'root',
  'Scar2511@#',
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);

module.exports = sequelize;
