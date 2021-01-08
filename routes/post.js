const router = require('express').Router();

const {
  addPost,
  deletePost,
  getPosts,
  getPost
} = require('../controllers/post');

const { protect } = require('../middleware/auth');
const { route } = require('./auth');
router.post('/', addPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.delete('/:id', deletePost);

module.exports = router;
