import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { RedemptionItem } from '../models/RedemptionItem.js';
import { Tier } from '../models/Tier.js';

const router = express.Router();

router.get('/tiers', async (_req, res) => {
  const tiers = await Tier.find().sort({ minPoints: 1 });
  return res.json(tiers);
});

router.get('/items', async (_req, res) => {
  const items = await RedemptionItem.find({ active: true }).sort({ pointsCost: 1 });
  return res.json(items);
});

router.post('/items', authMiddleware, async (req, res) => {
  const { name, pointsCost } = req.body;
  if (!name || !pointsCost) {
    return res.status(400).json({ message: 'name and pointsCost are required' });
  }

  const item = await RedemptionItem.create({ name, pointsCost });
  return res.status(201).json(item);
});

export default router;
