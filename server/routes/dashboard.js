const router = require('express').Router();
const { authRequired } = require('../middleware/auth');
const { summary } = require('../controllers/dashboardController');
const { isStaff } = require('../middleware/roles');
router.get('/summary', authRequired, isStaff, summary);
module.exports = router;