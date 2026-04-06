const express = require('express');
const sequelize = require('./config/db');
const User = require('./models/User');
const Bus = require('./models/Bus');
const Booking = require('./models/Booking');
const Payment = require('./models/Payment');
const userRoutes = require('./routes/users');
const busRoutes = require('./routes/buses');

const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/buses', busRoutes);

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();

  await User.bulkCreate([
    { name: 'Aman', email: 'aman@gmail.com' },
    { name: 'Rohit', email: 'rohit@gmail.com' },
    { name: 'Neha', email: 'neha@gmail.com' }
  ]);

  await Bus.bulkCreate([
    { busNumber: 'MH12-1001', totalSeats: 40, availableSeats: 18 },
    { busNumber: 'MH12-1002', totalSeats: 50, availableSeats: 8 }
  ]);

  app.listen(3000);
})();
