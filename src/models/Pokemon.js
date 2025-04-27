import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
  id:   { type: Number, required: true, unique: true },
  name: {
    english:  { type: String, required: true },
    japanese: String,
    french:   String,
    german:   String,
    spanish:  String,
  },
  type:   [String],
  base: {
    HP:      Number,
    Attack:  Number,
    Defense: Number,
    SpAtk:   Number,
    SpDef:   Number,
    Speed:   Number,
  },
  image:  String,
});

export default mongoose.model('Pokemon', pokemonSchema);
