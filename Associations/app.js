const express = require('express');
const sequelize = require('./config/db');
const User = require('./models/User');
const Post = require('./models/Post');
const routes = require('./routes/userPostRoutes');

const app = express();
app.use(express.json());
app.use(routes);

User.hasMany(Post);
Post.belongsTo(User);

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(3000);
})();
