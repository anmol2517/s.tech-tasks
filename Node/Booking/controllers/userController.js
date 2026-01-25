const User = require('../models/User');

exports.addUser = async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
};

exports.getUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

exports.deleteUser = async (req, res) => {
  const deleted = await User.destroy({
    where: { id: req.params.id }
  });
  res.json({ deleted });
};
