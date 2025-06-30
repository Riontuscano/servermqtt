import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }
});

export default model('User', userSchema); 
export const findOne = model('User', userSchema).findOne;