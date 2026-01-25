const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Student = sequelize.define('Student', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: DataTypes.STRING
});

module.exports = Student;
