const router = require('express').Router();

const { addSong, getSongs } = require('../controllers/song');

const { protect } = require('../middleware/auth');
router.post('/add-song', protect, addSong);
router.get('/', getSongs)

module.exports = router;
