import express from 'express';
import mongoose from 'mongoose';
import { authMiddleware } from '../middleware/auth.js';
import { Member } from '../models/Member.js';
import { RedemptionItem } from '../models/RedemptionItem.js';
import { Transaction } from '../models/Transaction.js';
import { calculatePurchasePoints, getMemberPointsSummary } from '../utils/loyalty.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/', async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ message: 'name and phone are required' });
  }

  const existing = await Member.findOne({ phone });
  if (existing) {
    return res.status(409).json({ message: 'Phone already exists' });
  }

  const member = await Member.create({ name, phone });
  return res.status(201).json(member);
});

router.get('/', async (req, res) => {
  const { search = '', page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  const safeSortBy = ['name', 'phone', 'createdAt', 'updatedAt'].includes(sortBy) ? sortBy : 'createdAt';
  const safeSortOrder = sortOrder === 'asc' ? 1 : -1;
  const safePage = Math.max(1, Number(page));
  const safeLimit = Math.min(100, Math.max(1, Number(limit)));

  const filter = search
    ? {
        $or: [{ phone: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }],
      }
    : {};

  const [items, total] = await Promise.all([
    Member.find(filter)
      .sort({ [safeSortBy]: safeSortOrder })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit),
    Member.countDocuments(filter),
  ]);

  return res.json({
    data: items,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      pages: Math.ceil(total / safeLimit),
    },
  });
});

router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid member ID' });
  }

  const member = await Member.findById(req.params.id);
  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  const summary = await getMemberPointsSummary(member._id);
  return res.json({ member, summary });
});

router.get('/:id/transactions', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid member ID' });
  }

  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  const safeSortBy = ['amount', 'points', 'createdAt', 'type'].includes(sortBy) ? sortBy : 'createdAt';
  const safeSortOrder = sortOrder === 'asc' ? 1 : -1;
  const safePage = Math.max(1, Number(page));
  const safeLimit = Math.min(100, Math.max(1, Number(limit)));

  const filter = { member: req.params.id };
  const [items, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ [safeSortBy]: safeSortOrder })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit),
    Transaction.countDocuments(filter),
  ]);

  return res.json({
    data: items,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      pages: Math.ceil(total / safeLimit),
    },
  });
});

router.post('/:id/purchase', async (req, res) => {
  const { amount } = req.body;
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ message: 'amount must be a positive number' });
  }

  const member = await Member.findById(req.params.id);
  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  const summary = await getMemberPointsSummary(member._id);
  const { earnedPoints, tier } = await calculatePurchasePoints(numericAmount, summary.lifetimePoints);

  const transaction = await Transaction.create({
    member: member._id,
    staffUser: req.user.id,
    type: 'purchase',
    amount: numericAmount,
    points: earnedPoints,
    description: `Purchase with ${tier.name} x${tier.multiplier} multiplier`,
  });

  const updatedSummary = await getMemberPointsSummary(member._id);
  return res.status(201).json({ transaction, summary: updatedSummary });
});

router.post('/:id/redeem', async (req, res) => {
  const { itemId, quantity = 1 } = req.body;
  const qty = Number(quantity);

  if (!mongoose.Types.ObjectId.isValid(itemId) || !Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json({ message: 'Valid itemId and quantity are required' });
  }

  const member = await Member.findById(req.params.id);
  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  const item = await RedemptionItem.findById(itemId);
  if (!item || !item.active) {
    return res.status(404).json({ message: 'Reward item not found' });
  }

  const summary = await getMemberPointsSummary(member._id);
  const totalCost = item.pointsCost * qty;

  if (summary.pointsBalance < totalCost) {
    return res.status(400).json({ message: 'Insufficient points for redemption' });
  }

  const transaction = await Transaction.create({
    member: member._id,
    staffUser: req.user.id,
    type: 'redemption',
    amount: 0,
    points: -totalCost,
    description: `Redeemed ${qty} x ${item.name}`,
  });

  const updatedSummary = await getMemberPointsSummary(member._id);
  return res.status(201).json({ transaction, summary: updatedSummary });
});

export default router;
