const router = require('express').Router();
const { register, login } = require('../controllers/authController');
const { validateBody, required, email, password } = require('../middleware/validate');
router.post('/register', validateBody([required('name', 'Name'), required('email', 'Email'), required('password', 'Password'), email, password]), register);
router.post('/login', validateBody([required('email', 'Email'), required('password', 'Password'), email]), login);
module.exports = router;