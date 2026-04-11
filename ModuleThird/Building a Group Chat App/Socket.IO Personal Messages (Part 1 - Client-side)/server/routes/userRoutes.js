const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).sort({ username: 1 }).lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch users' });
  }
});

router.post('/', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    let user = await User.findOne({ username });
    if (!user) {
      user = await User.create({ username });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Unable to create user' });
  }
});

module.exports = router;
