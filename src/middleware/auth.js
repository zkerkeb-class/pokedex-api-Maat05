import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) throw new Error('User not found');
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token invalid/expired' });
  }
};

export const requireRole = role => (req, res, next) => {
  if (req.user?.role === role || req.user?.role === 'admin') return next();
  res.status(403).json({ message: 'Forbidden' });
};
