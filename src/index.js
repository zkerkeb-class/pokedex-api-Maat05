import express from "express";
import cors from "cors";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

// Lire le fichier JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pokemonsList = JSON.parse(fs.readFileSync(path.join(__dirname, './data/pokemons.json'), 'utf8'));

const app = express();
const PORT = 3000;

// Middleware pour CORS
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour servir des fichiers statiques
// 'app.use' est utilisé pour ajouter un middleware à notre application Express
// '/assets' est le chemin virtuel où les fichiers seront accessibles
// 'express.static' est un middleware qui sert des fichiers statiques
// 'path.join(__dirname, '../assets')' construit le chemin absolu vers le dossier 'assets'
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Route GET de base
app.get("/api/pokemons", (req, res) => {
  res.status(200).send({
    types: [
      "Fire",
      "Water",
      "Grass",
      "Electric",
      "Ice",
      "Fighting",
      "Poison",
      "Ground",
      "Flying",
      "Psychic",
      "Bug",
      "Rock",
      "Ghost",
      "Dragon",
      "Steel",
      "Fairy",
    ],
    pokemons: pokemonsList,
  });
});

app.get("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemon = pokemonsList.find((p) => p.id === id);
  if(!pokemon){
    return res.status(404).send({error : "pas de pokémon avec cet id"});
  }
  res.status(200).json(pokemon);
});

app.post("/api/pokemons/add/:id", (req, res) =>{
  const { id, name, types, baseHP, baseAttack, baseDefense, SpAttack, SpDefense, Speed, image } = req.body;
  const { english, japanese, chinese, french } = name;
  if (pokemonsList.some(pokemon => pokemon.id === id)) {
    return res.status(409).json({ error: "Pokémon existant" });
  }
  const newPokemon = {
    id,
    name: {
      english,
      japanese,
      chinese,
      french
    },
    types,
    base: {
      baseHP,
      baseAttack,
      baseDefense,
      SpAttack,
      SpDefense,
      Speed
    },
    image
  };
  pokemonsList.push(newPokemon);
  fs.writeFileSync(
    path.join(__dirname, './data/pokemons.json'),
    JSON.stringify(pokemonsList, null, 2)
  );
  res.status(201).json(newPokemon);
});

app.put("/api/pokemons/modify/:id", (req, res) => {
  const { id, name, types, baseHP, baseAttack, baseDefense, SpAttack, SpDefense, Speed, image } = req.body;
  const indice = pokemonsList.findIndex((p) => p.id === id);
  if (indice === -1) {
    return res.status(404).json({ error: "Pokémon non trouvé" });
  }
  const { english, japanese, chinese, french } = name;
  const updatedPokemon= {
    id,
    name : {
      english,
      japanese,
      chinese,
      french
    },
    types,
    base : {
      baseHP,
      baseAttack, 
      baseDefense, 
      SpAttack, 
      SpDefense, 
      Speed
    },
    image
  };
  pokemonsList[indice] = updatedPokemon;
  fs.writeFileSync(
    path.join(__dirname, './data/pokemons.json'),
    JSON.stringify(pokemonsList, null, 2)
  );
  res.status(200).json(updatedPokemon);
});

app.delete("/api/pokemons/remove/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = pokemonsList.findIndex((p) => p.id === id);
  if(index === -1){
    return res.status(404).send({error : "pas de pokémon avec cet id"});
  }
  const deletedPokemon = pokemonsList.splice(index, 1);
  fs.writeFileSync(
    path.join(__dirname, "./data/pokemons.json"),
    JSON.stringify(pokemonsList, null, 2)
  );
  res.status(200).json(deletedPokemon[0]);
});

app.get("/", (req, res) => {
  res.send("bienvenue sur l'API Pokémon");
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
