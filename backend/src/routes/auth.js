import express from 'express';
import jwt from 'jsonwebtoken';
import { StaffUser } from '../models/StaffUser.js';

const router = express.Router();

const signToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '8h',
  });

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }

  const existing = await StaffUser.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const user = await StaffUser.create({ name, email, password });
  return res.status(201).json({ token: signToken(user), user: { id: user._id, name: user.name, email: user.email } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await StaffUser.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.json({ token: signToken(user), user: { id: user._id, name: user.name, email: user.email } });
});

export default router;
