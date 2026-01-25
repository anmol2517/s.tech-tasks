const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StudentCourse = sequelize.define('StudentCourse', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
});

module.exports = StudentCourse;
