import User, { findOne } from '../models/User.js';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function signup(req, res) {
  const { fullname, username, email, phone, password } = req.body;
  if (!fullname || !username || !email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const existingUser = await findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await hash(password, 10);
    const user = new User({ fullname, username, email, phone, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ user: { fullname: user.fullname, username: user.username, email: user.email, phone: user.phone }, token });
  } catch (err) {
    res.status(500).json(err.message);
  } 
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ user: { fullname: user.fullname, username: user.username, email: user.email, phone: user.phone }, token });
  } catch (err) {
    res.status(500).json(err.message);
  }
} 