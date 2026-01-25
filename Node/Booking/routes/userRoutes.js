const express = require('express');
const router = express.Router();
const {
  addUser,
  getUsers,
  deleteUser
} = require('../controllers/userController');

router.post('/users', addUser);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
