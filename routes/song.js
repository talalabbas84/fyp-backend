const router = require('express').Router();

const { addSong } = require('../controllers/song');

const { protect } = require('../middleware/auth');
router.post('/add-song', protect, addSong);

module.exports = router;
