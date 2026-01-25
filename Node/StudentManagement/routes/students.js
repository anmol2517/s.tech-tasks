const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { name, email, age } = req.body;
  db.query(
    'INSERT INTO students (name, email, age) VALUES (?, ?, ?)',
    [name, email, age],
    (err, result) => {
      if (err) return res.status(400).send('Insert failed');
      console.log('Inserted:', result.insertId);
      res.send('Student added');
    }
  );
});

router.get('/', (req, res) => {
  db.query('SELECT * FROM students', (err, result) => {
    res.json(result);
  });
});

router.get('/:id', (req, res) => {
  db.query(
    'SELECT * FROM students WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (result.length === 0) return res.status(404).send('Not found');
      res.json(result[0]);
    }
  );
});

router.put('/:id', (req, res) => {
  const { name, email, age } = req.body;
  db.query(
    'UPDATE students SET name = ?, email = ?, age = ? WHERE id = ?',
    [name, email, age, req.params.id],
    (err, result) => {
      if (result.affectedRows === 0) return res.status(404).send('Not found');
      console.log('Updated:', req.params.id);
      res.send('Student updated');
    }
  );
});

router.delete('/:id', (req, res) => {
  db.query(
    'DELETE FROM students WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (result.affectedRows === 0) return res.status(404).send('Not found');
      console.log('Deleted:', req.params.id);
      res.send('Student deleted');
    }
  );
});

module.exports = router;
