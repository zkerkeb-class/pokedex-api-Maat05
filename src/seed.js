import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Pokemon from './models/Pokemon.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lire les données JSON
const pokemonsData = JSON.parse(fs.readFileSync(path.join(__dirname, './data/pokemons.json')));

// Connexion à la BDD
mongoose.connect('mongodb://localhost:27017/Pokedex', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("📦 Connecté à MongoDB");

    try {
      await Pokemon.deleteMany(); // On vide la BDD
      const result = await Pokemon.insertMany(pokemonsData); // On insère les données JSON
      console.log("Données insérées avec succès !");
      //console.log(result); // Afficher les documents insérés
    } catch (err) {
      console.error("Erreur lors de l'insertion des données :", err);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(err => {
    console.error("Erreur de connexion à MongoDB :", err);
  });
