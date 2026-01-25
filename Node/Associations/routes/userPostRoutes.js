const express = require('express');
const router = express.Router();
const {
  createUserWithPost,
  getUsersWithPosts
} = require('../controllers/userPostController');

router.post('/user-post', createUserWithPost);
router.get('/user-post', getUsersWithPosts);

module.exports = router;
