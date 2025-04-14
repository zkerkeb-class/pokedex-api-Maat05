import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  type:String,
  type:String,
 }, { collection: 'users' });
  
  const User = mongoose.model('User', userSchema);
  
  export default User;