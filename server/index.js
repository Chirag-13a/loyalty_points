require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const memberRoutes = require('./routes/members');
const rewardRoutes = require('./routes/rewards');
const dashboardRoutes = require('./routes/dashboard');
const memberAuthRoutes = require('./routes/memberAuthRoutes');
const memberPortalRoutes = require('./routes/memberPortalRoutes');
const memberSelfRoutes = require('./routes/memberSelfRoutes');
const menuRoutes = require('./routes/menuRoutes');
const { seedCatalog } = require('./seed');

const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'cafe-loyalty-api' }));
app.use('/api/auth', authRoutes);
app.use('/api', memberSelfRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/member/auth', memberAuthRoutes);
app.use('/api/member', memberPortalRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (_req, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')));
}

const port = process.env.PORT || 5000;
async function start() {
  if (process.env.MONGODB_URI) {
    try { await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 3000 }); await seedCatalog(); console.log('MongoDB connected'); }
    catch (error) { console.warn(`MongoDB unavailable (${error.message}). Using local JSON store at server/data/store.json.`); }
  } else {
    console.warn('MONGODB_URI is not set. Using local JSON store at server/data/store.json.');
  }
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
}

start().catch((error) => { console.error(error); process.exit(1); });