const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { busNumber, totalSeats, availableSeats } = req.body;
  db.query(
    'INSERT INTO Buses (busNumber, totalSeats, availableSeats) VALUES (?, ?, ?)',
    [busNumber, totalSeats, availableSeats],
    () => res.send('Bus added')
  );
});

router.get('/available/:seats', (req, res) => {
  db.query(
    'SELECT * FROM Buses WHERE availableSeats > ?',
    [req.params.seats],
    (err, result) => {
      res.json(result);
    }
  );
});

module.exports = router;
