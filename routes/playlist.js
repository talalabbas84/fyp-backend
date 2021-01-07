const router = require('express').Router();

const {
  createPlaylist,
  addSongToPlaylist,
  getPlaylistWithId,
  getPlaylists,
  deletePlaylist
} = require('../controllers/playlist');

const { protect } = require('../middleware/auth');
// router.post('/add-song', protect, addSong);
router.post('/add-playlist', createPlaylist);
router.put('/add-song-to-playlist', addSongToPlaylist);
router.get('/:id', getPlaylistWithId);
router.get('/', getPlaylists);
router.delete('/:id', deletePlaylist);

module.exports = router;
