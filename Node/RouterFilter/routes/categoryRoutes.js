const express = require('express');
const router = express.Router();


// GET

router.get('/', (req, res) => {
  res.send("Here is the list of all categories.");
});


// POST

router.post('/', (req, res) => {
  res.send("A new category has been created.");
});

module.exports = router;
