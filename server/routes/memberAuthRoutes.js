const router = require('express').Router();
const { register, login } = require('../controllers/memberAuthController');
const { validateBody, required, email, password, phone } = require('../middleware/validate');
router.post('/register', validateBody([required('name', 'Name'), required('phone', 'Phone'), required('password', 'Password'), phone, email, password]), register);
router.post('/login', validateBody([required('phone', 'Phone'), required('password', 'Password'), phone]), login);
module.exports = router;
