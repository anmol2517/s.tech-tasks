const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Expense = sequelize.define('Expense', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: DataTypes.STRING,
  amount: DataTypes.FLOAT,
  category: DataTypes.STRING
});

module.exports = Expense;
