const router = require('express').Router();

const { addSong, getSongs, getSongById } = require('../controllers/song');

const { protect } = require('../middleware/auth');
const { route } = require('./auth');
router.post('/add-song', protect, addSong);
router.get('/', getSongs);
router.get('/:id', getSongById);

module.exports = router;
