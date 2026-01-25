const User = require('../models/User');
const Post = require('../models/Post');

exports.createUserWithPost = async (req, res) => {
  const user = await User.create(req.body.user);
  const post = await Post.create({ ...req.body.post, UserId: user.id });
  res.json({ user, post });
};

exports.getUsersWithPosts = async (req, res) => {
  const users = await User.findAll({ include: Post });
  res.json(users);
};
