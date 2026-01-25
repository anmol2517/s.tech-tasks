const { Sequelize } = require('sequelize');
const User = require('./models/User');

const sequelize = new Sequelize(
  'sequelize_db',
  'root',
  'Scar2511@#',
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);

sequelize.authenticate()
  .then(() => sequelize.sync())
  .then(() => console.log('DB Connected & Table Created'))
  .catch(err => console.log(err));

