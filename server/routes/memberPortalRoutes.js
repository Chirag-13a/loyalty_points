const router = require('express').Router();
const { authRequired } = require('../middleware/auth');
const { isMember } = require('../middleware/roles');
const { home, rewards, offers } = require('../controllers/memberPortalController');
router.use(authRequired, isMember);
router.get('/home', home);
router.get('/rewards', rewards);
router.get('/offers', offers);
module.exports = router;
