// src/routes/pokemonRoutes.js
import express from 'express';
import Pokemon from '../models/Pokemon.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Protect all pokemon routes by default
router.use(protect);

// GET /api/pokemons – list all (protected)
router.get('/', async (req, res) => {
  const list = await Pokemon.find();
  res.json(list);
});

// GET /api/pokemons/:id – get single (protected)
router.get('/:id', async (req, res) => {
  const p = await Pokemon.findOne({ id: req.params.id });
  if (!p) return res.status(404).json({ message: 'Pokémon not found' });
  res.json(p);
});

// POST /api/pokemons – trainers or admin
router.post('/', requireRole('trainer'), async (req, res) => {
  const newPoke = await Pokemon.create(req.body);
  res.status(201).json(newPoke);
});

// PUT /api/pokemons/:id – admin only
router.put('/:id', requireRole('admin'), async (req, res) => {
  const p = await Pokemon.findOneAndUpdate({ id: req.params.id }, req.body, {
    new: true,
  });
  res.json(p);
});

export default router;
