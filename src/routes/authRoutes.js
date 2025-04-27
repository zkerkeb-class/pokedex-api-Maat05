import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { username, password, role } = req.body;

    if (await User.findOne({ username })) {
      res.status(400);
      throw new Error('Utilisateur déjà existant');
    }

    const user = await User.create({ username, password, role });
    res.status(201).json({ id: user._id, username: user.username, role: user.role });
  }),
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select('+password');
    console.log('lookup user =>', user && user.username);

    if (!user || !(await user.matchPassword(password))) {
      console.log('password mismatch');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.json({ token });
  }),
);

export default router;
