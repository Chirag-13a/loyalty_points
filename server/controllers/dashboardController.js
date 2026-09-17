const { Member, Transaction } = require('../models');
const mongoose = require('mongoose');
const store = require('../localStore');

async function summary(_req, res) {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  if (!store.isMongoReady(mongoose)) { const data = store.read(); return res.json({ totalMembers: data.members.length, totalPointsIssued: data.members.reduce((total, member) => total + member.lifetimePoints, 0), redemptionsToday: data.transactions.filter(transaction => transaction.type === 'redeem' && new Date(transaction.createdAt) >= start).length }); }
  const [totalMembers, points, redemptionsToday] = await Promise.all([
    Member.countDocuments(),
    Member.aggregate([{ $group: { _id: null, total: { $sum: '$lifetimePoints' } } }]),
    Transaction.countDocuments({ type: 'redeem', createdAt: { $gte: start } })
  ]);
  res.json({ totalMembers, totalPointsIssued: points[0]?.total || 0, redemptionsToday });
}

module.exports = { summary };