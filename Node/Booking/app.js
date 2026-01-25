const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRoutes);

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(3000);
})();
