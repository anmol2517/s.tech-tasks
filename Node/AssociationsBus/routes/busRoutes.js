const express = require('express');
const router = express.Router();
const { createBus, getBusBookings } = require('../controllers/busController');

router.post('/buses', createBus);
router.get('/buses/:id/bookings', getBusBookings);

module.exports = router;
