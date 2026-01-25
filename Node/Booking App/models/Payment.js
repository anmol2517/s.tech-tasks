const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  amountPaid: DataTypes.FLOAT,
  paymentStatus: DataTypes.STRING
});

module.exports = Payment;
