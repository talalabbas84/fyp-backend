const router = require('express').Router();

const {register, login} = require('../controllers/auth');

// const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login )

module.exports = router;
