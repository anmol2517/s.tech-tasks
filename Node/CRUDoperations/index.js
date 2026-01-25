const { sequelize, User } = require('./models/User');

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();

  const user = await User.create({
    name: 'MS Dhoni',
    email: 'dhoni@example.com'
  });

  const users = await User.findAll();
  console.log(users);

  const userById = await User.findByPk(1);
  console.log(userById);

  await User.update(
    { name: 'Captain Cool', email: 'captaincool@example.com' },
    { where: { id: 1 } }
  );

  await User.destroy({
    where: { id: 1 }
  });

  const finalData = await User.findAll();
  console.log(finalData);

  process.exit();
})();
