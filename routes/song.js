const router = require('express').Router();

const {
  addSong,
  getSongs,
  getSongById,
  getSongbyLyrics
} = require('../controllers/song');

const { protect } = require('../middleware/auth');
const { route } = require('./auth');
router.post('/add-song', addSong);
router.get('/', getSongs);
router.get('/:id', getSongById);
router.post('/get-song-by-lyrics', getSongbyLyrics);

module.exports = router;
