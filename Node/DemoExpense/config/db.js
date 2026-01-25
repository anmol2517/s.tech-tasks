const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'expense_app_db',
  'root',
  'your_pass',
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);

module.exports = sequelize;
