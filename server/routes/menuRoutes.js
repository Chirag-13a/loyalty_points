const router = require('express').Router();
const { listMenu } = require('../controllers/menuController');
router.get('/', listMenu);
module.exports = router;