const router = require('express').Router();
const { authRequired } = require('../middleware/auth');
const { isMember } = require('../middleware/roles');
const { memberVisits, getOwnProfile, updateOwnProfile } = require('../controllers/memberPortalController');
const { validateBody, phone, email, password } = require('../middleware/validate');
router.get('/members/me', authRequired, isMember, getOwnProfile);
router.put('/members/me', authRequired, isMember, validateBody([phone, email, password]), updateOwnProfile);
router.get('/members/me/transactions', authRequired, isMember, memberVisits);
module.exports = router;