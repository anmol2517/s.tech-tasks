const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

router.post('/signup', async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: 'Please provide name, email, phone and password.' });
  }

  try {
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    const existingPhone = await User.findOne({ phone });

    if (existingEmail || existingPhone) {
      return res.status(400).json({ message: 'Email or phone number already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating user.' });
  }
});

router.post('/login', async (req, res) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
    return res.status(400).json({ message: 'Please provide email or phone and password.' });
  }

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrPhone.toLowerCase() }, { phone: emailOrPhone }],
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password.' });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while logging in.' });
  }
});

module.exports = router;
