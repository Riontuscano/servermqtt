import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import espDataRoutes from './routes/espDataRoutes.js';
import authRoutes from './routes/userRoutes.js';
import './mqtt/mqttClient.js';
import petRoutes from './routes/petRoutes.js';

const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin:['*','http://localhost:5173','https://servermqtt.vercel.app'] }));
app.use(express.json({ limit: '10mb' }));

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  ssl: true
});
const db = mongoose.connection;
db.once('open', () => console.log('MongoDB Connected'));
db.on('error', console.error);

app.get('/', (req, res) => {
  res.send('ESP32 Step & Sensor Backend is Running');
});

app.use('/api', espDataRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
}); 
