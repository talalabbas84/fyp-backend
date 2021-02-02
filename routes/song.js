const router = require('express').Router();

const {
  addSong,
  getSongs,
  getSongById,
  getSongbyLyrics
} = require('../controllers/song');

const { protect } = require('../middleware/auth');
const { route } = require('./auth');
router.post('/get-song-by-lyrics', getSongbyLyrics);
router.post('/add-song', addSong);
router.get('/', getSongs);
router.get('/:id', getSongById);

module.exports = router;
