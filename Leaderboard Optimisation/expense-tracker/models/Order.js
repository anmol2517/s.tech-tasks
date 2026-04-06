const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  orderId: { type: DataTypes.STRING, allowNull: false, unique: true },
  paymentSessionId: { type: DataTypes.STRING, allowNull: false },
  status: {
    type: DataTypes.ENUM('PENDING', 'SUCCESSFUL', 'FAILED'),
    defaultValue: 'PENDING',
  },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Order;
