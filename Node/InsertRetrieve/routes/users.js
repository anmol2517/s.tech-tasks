const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { name, email } = req.body;
  db.query(
    'INSERT INTO Users (name, email) VALUES (?, ?)',
    [name, email],
    () => res.send('User added')
  );
});

router.get('/', (req, res) => {
  db.query('SELECT * FROM Users', (err, result) => {
    res.json(result);
  });
});

module.exports = router;
