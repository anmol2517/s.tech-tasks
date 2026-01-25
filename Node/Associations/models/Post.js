const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Post = sequelize.define('Post', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: DataTypes.STRING,
  content: DataTypes.STRING
});

module.exports = Post;
