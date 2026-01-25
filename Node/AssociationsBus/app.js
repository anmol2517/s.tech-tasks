const express = require('express');
const sequelize = require('./config/db');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const busRoutes = require('./routes/busRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use(userRoutes);
app.use(busRoutes);
app.use(bookingRoutes);

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(3000);
})();
