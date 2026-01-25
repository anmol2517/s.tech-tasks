const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM Customers', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

module.exports = router;
