const mongoose = require('mongoose');
const { MenuItem } = require('../models');
const store = require('../localStore');
async function listMenu(_req, res) { if (!store.isMongoReady(mongoose)) { const data = store.read(); const items = (data.menuItems || []).filter(item => item.available); return res.json({ items, categories: [...new Set(items.map(item => item.category))] }); } const items = await MenuItem.find({ available: true }).sort({ category: 1, name: 1 }); res.json({ items, categories: [...new Set(items.map(item => item.category))] }); }
module.exports = { listMenu };