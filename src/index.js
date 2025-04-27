// src/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import pokemonRoutes from './routes/pokemonRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
await connectDB();

const app = express();

// Pour __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Lecture de la config CORS
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://192.168.56.1:5173';
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,                            // si vous utilisez des cookies / sessions
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Activer CORS pour toutes les routes et pré-vol OPTIONS
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware JSON
app.use(express.json());

// Assets statiques (sprites, etc.)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Routes
app.get('/', (req, res) => res.send('🎉 API Pokémon prête !'));
app.use('/api/auth',     authRoutes);
app.use('/api/pokemons', pokemonRoutes);

// Gestion des erreurs
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur http://0.0.0.0:${PORT}`);
});
