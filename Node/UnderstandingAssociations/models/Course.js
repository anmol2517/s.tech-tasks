const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Course = sequelize.define('Course', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: DataTypes.STRING
});

module.exports = Course;
