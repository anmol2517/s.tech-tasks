const express = require('express');
const router = express.Router();
const { createUser, getUserBookings } = require('../controllers/userController');

router.post('/users', createUser);
router.get('/users/:id/bookings', getUserBookings);

module.exports = router;
