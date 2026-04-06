const express = require('express');
const router = express.Router();
const { Cashfree } = require('cashfree-pg');
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/Order');
const User = require('../models/User');
const auth = require('../middleware/auth');
require('dotenv').config();

Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

// Create Order
router.post('/create-order', auth, async (req, res) => {
  try {
    const user = req.user;
    const orderId = 'order_' + uuidv4().replace(/-/g, '').substring(0, 12);
    const amount = 499;

    const orderRequest = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: String(user.id),
        customer_name: user.name,
        customer_email: user.email,
        customer_phone: '9999999999',
      },
    };

    const response = await Cashfree.PGCreateOrder('2023-08-01', orderRequest);
    const { payment_session_id } = response.data;

    await Order.create({
      orderId,
      paymentSessionId: payment_session_id,
      status: 'PENDING',
      amount,
      userId: user.id,
    });

    res.json({ orderId, paymentSessionId: payment_session_id });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Verify Payment
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { orderId } = req.body;
    const user = req.user;

    const order = await Order.findOne({ where: { orderId, userId: user.id } });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const response = await Cashfree.PGOrderFetchPayments(orderId);
    const payments = response.data;

    const success = Array.isArray(payments) && payments.some(p => p.payment_status === 'SUCCESS');

    if (success) {
      await order.update({ status: 'SUCCESSFUL' });
      await User.update({ isPremium: true }, { where: { id: user.id } });
      return res.json({ status: 'SUCCESSFUL' });
    } else {
      await order.update({ status: 'FAILED' });
      return res.json({ status: 'FAILED' });
    }
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ message: 'Verification failed' });
  }
});

module.exports = router;
