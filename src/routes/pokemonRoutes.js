import express from 'express';
import Pokemon from '../models/Pokemon.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/pokemon – public
router.get('/', async (req, res) => {
  const list = await Pokemon.find();
  res.json(list);
});

// GET /api/pokemon/:id – public
router.get('/:id', async (req, res) => {
  const p = await Pokemon.findOne({ id: req.params.id });
  if (!p) return res.status(404).json({ message: 'Pokémon not found' });
  res.json(p);
});

// POST /api/pokemon – trainers/admin
router.post('/', protect, requireRole('trainer'), async (req, res) => {
  const newPoke = await Pokemon.create(req.body);
  res.status(201).json(newPoke);
});

// PUT /api/pokemon/:id – admin only
router.put('/:id', protect, requireRole('admin'), async (req, res) => {
  const p = await Pokemon.findOneAndUpdate({ id: req.params.id }, req.body, {
    new: true,
  });
  res.json(p);
});

export default router;
