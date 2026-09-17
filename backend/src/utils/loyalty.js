import { Tier } from '../models/Tier.js';
import { Transaction } from '../models/Transaction.js';

export const getPointsPerTenRupees = () => Number(process.env.POINTS_PER_10_RUPEES || 1);

export const calculatePurchasePoints = async (amount, lifetimePoints) => {
  const tier = await getTierForPoints(lifetimePoints);
  const basePoints = (amount / 10) * getPointsPerTenRupees();
  const earnedPoints = Math.round(basePoints * tier.multiplier);
  return { earnedPoints, tier };
};

export const getTierForPoints = async (points) => {
  const tier =
    (await Tier.findOne({ minPoints: { $lte: points }, $or: [{ maxPoints: null }, { maxPoints: { $gte: points } }] })) ||
    (await Tier.findOne({ name: 'Bronze' }));

  return tier;
};

export const getMemberPointsSummary = async (memberId) => {
  const summary = await Transaction.aggregate([
    { $match: { member: memberId } },
    {
      $group: {
        _id: null,
        pointsBalance: { $sum: '$points' },
        lifetimePoints: {
          $sum: {
            $cond: [{ $gt: ['$points', 0] }, '$points', 0],
          },
        },
      },
    },
  ]);

  const pointsBalance = summary[0]?.pointsBalance || 0;
  const lifetimePoints = summary[0]?.lifetimePoints || 0;
  const tier = await getTierForPoints(lifetimePoints);
  const nextTier = await Tier.findOne({ minPoints: { $gt: tier.minPoints } }).sort({ minPoints: 1 });

  return {
    pointsBalance,
    lifetimePoints,
    tier,
    nextTier,
    progressToNextTier: nextTier
      ? Math.min(100, Math.round((lifetimePoints / nextTier.minPoints) * 100))
      : 100,
  };
};

export const ensureDefaultTiers = async () => {
  const defaults = [
    { name: 'Bronze', multiplier: 1, minPoints: 0, maxPoints: 499, badgeColor: '#9CA3AF' },
    { name: 'Silver', multiplier: 1.25, minPoints: 500, maxPoints: 1499, badgeColor: '#94A3B8' },
    { name: 'Gold', multiplier: 1.5, minPoints: 1500, maxPoints: null, badgeColor: '#D4A017' },
  ];

  for (const tier of defaults) {
    await Tier.updateOne({ name: tier.name }, { $set: tier }, { upsert: true });
  }
};
