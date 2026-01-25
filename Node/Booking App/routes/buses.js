const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');
const { Op } = require('sequelize');

router.post('/', async (req, res) => {
  const bus = await Bus.create(req.body);
  res.json(bus);
});

router.get('/available/:seats', async (req, res) => {
  const buses = await Bus.findAll({
    where: {
      availableSeats: { [Op.gt]: req.params.seats }
    }
  });
  res.json(buses);
});

module.exports = router;
