const router = require('express').Router();
const { authRequired } = require('../middleware/auth');
const { listMembers, createMember, getMember, recordPurchase, redeemReward, listTransactions } = require('../controllers/memberController');
const { validateBody, required, phone, email, positiveNumber } = require('../middleware/validate');
const { isStaff } = require('../middleware/roles');

router.use(authRequired, isStaff);
router.get('/', listMembers);
router.post('/', validateBody([required('name', 'Name'), required('phone', 'Phone'), phone, email]), createMember);
router.get('/:id', getMember);
router.post('/:id/purchases', validateBody([positiveNumber('amount')]), recordPurchase);
router.post('/:id/redemptions', validateBody([required('itemId', 'Reward')]), redeemReward);
router.get('/:id/transactions', listTransactions);
module.exports = router;
