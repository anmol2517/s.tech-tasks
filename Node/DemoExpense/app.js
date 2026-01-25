const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(expenseRoutes);

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(3000);
})();
