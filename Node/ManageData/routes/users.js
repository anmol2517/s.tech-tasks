const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/add', (req, res) => {
  const { name, email } = req.body;
  const sql = 'INSERT INTO Users (name, email) VALUES (?, ?)';
  db.query(sql, [name, email], (err, result) => {
    if (err) throw err;
    res.send('User inserted');
  });
});

router.put('/update/:id', (req, res) => {
  const { name, email } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE Users SET name = ?, email = ? WHERE id = ?';
  db.query(sql, [name, email, id], (err, result) => {
    if (err) throw err;
    res.send('User updated');
  });
});

module.exports = router;
