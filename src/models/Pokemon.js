import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    english: { type: String, required: true },
    japanese: { type: String },
    chinese: { type: String },
    french: { type: String },
  },
  type: [String],
  base: {
    HP: { type: Number },
    Attack: { type: Number },
    Defense: { type: Number },
    "Sp. Attack": { type: Number },
    "Sp. Defense": { type: Number },
    Speed: { type: Number },
  },
  image: { type: String },
}, { collection: 'pokemons' });

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

export default Pokemon;
