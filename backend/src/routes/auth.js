import express from 'express';
import jwt from 'jsonwebtoken';
import { StaffUser } from '../models/StaffUser.js';

const router = express.Router();

const isValidEmail = (email) => {
  if (typeof email !== 'string' || email.length < 5 || email.length > 254) {
    return false;
  }
  const atIndex = email.indexOf('@');
  const dotIndex = email.lastIndexOf('.');
  return atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < email.length - 1;
};

const signToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '8h',
  });

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const safeName = typeof name === 'string' ? name.trim() : '';
  const safeEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const safePassword = typeof password === 'string' ? password : '';

  if (!safeName || !safeEmail || !safePassword) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }
  if (!isValidEmail(safeEmail)) {
    return res.status(400).json({ message: 'Valid email is required' });
  }

  const existing = await StaffUser.findOne().where('email').equals(safeEmail);
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const user = await StaffUser.create({ name: safeName, email: safeEmail, password: safePassword });
  return res.status(201).json({ token: signToken(user), user: { id: user._id, name: user.name, email: user.email } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const safeEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const safePassword = typeof password === 'string' ? password : '';
  if (!isValidEmail(safeEmail) || !safePassword) {
    return res.status(400).json({ message: 'Valid email and password are required' });
  }

  const user = await StaffUser.findOne().where('email').equals(safeEmail);

  if (!user || !(await user.comparePassword(safePassword))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.json({ token: signToken(user), user: { id: user._id, name: user.name, email: user.email } });
});

export default router;
