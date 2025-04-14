import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import pokemonRoutes from "./routes/pokemonRoutes.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// const express = require('express');
// Résolution des chemins en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ce middleware rend disponible les fichiers du dossier src/assets via /assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Configuration des variables d'environnement
dotenv.config();

// Connexion à MongoDB
connectDB();

const users = [
  {
    id: 1,
    username: 'admin',
    password: 'password123', //password123
    role: 'admin'
  }
];

// Configuration d'Express
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Configuration CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Routes
app.use(pokemonRoutes);

// Route de base
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Pokémon avec MongoDB");
});

// Route de connexion
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)
  // console.log(users)
  
  // Recherche de l'utilisateur
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Identifiants invalides eff' });
  }

  // Vérification du mot de passe
  // const isMatch = await bcrypt.compare(password, user.password);
  const isMatch = user.password === password
  if (!isMatch) {
    return res.status(400).json({ message: 'Identifiants invalides' });

  }

  // Création du payload JWT
  const payload = {
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  };

  // Génération du token
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
});
// Middleware pour vérifier le JWT
const auth = (req, res, next) => {
  // Récupération du token depuis l'en-tête
  const token = req.header('x-auth-token');

  // Vérification de la présence du token
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé, token manquant' });
  }

  try {
    // Vérification du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajout des informations utilisateur à l'objet requête
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

// Route protégée - accessible uniquement avec un token valide
app.get('/api/profile', auth, (req, res) => {
  res.json({
    message: 'Profil récupéré avec succès',
    user: req.user
  });
});

// Route protégée avec vérification de rôle
app.get('/api/admin', auth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé: droits d\'administrateur requis' });
  }

  res.json({
    message: 'Zone administrative',
    user: req.user
  });
});

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur http://0.0.0.0:${PORT}`);
});

