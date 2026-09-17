import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/db.js';
import { apiLimiter, authLimiter } from './middleware/rateLimit.js';
import authRoutes from './routes/auth.js';
import memberRoutes from './routes/members.js';
import rewardsRoutes from './routes/rewards.js';
import { RedemptionItem } from './models/RedemptionItem.js';
import { ensureDefaultTiers } from './utils/loyalty.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/members', apiLimiter, memberRoutes);
app.use('/api/rewards', apiLimiter, rewardsRoutes);

const seedRewards = async () => {
  const defaults = [
    { name: 'Espresso Shot', pointsCost: 80 },
    { name: 'Cappuccino', pointsCost: 150 },
    { name: 'Signature Pastry', pointsCost: 200 },
  ];

  for (const item of defaults) {
    await RedemptionItem.updateOne({ name: item.name }, { $set: item }, { upsert: true });
  }
};

const PORT = Number(process.env.PORT || 5000);

const start = async () => {
  try {
    await connectDB();
    await ensureDefaultTiers();
    await seedRewards();
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();
