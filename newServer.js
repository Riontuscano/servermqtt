import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import espDataRoutes from './routes/espDataRoutes.js';
import './mqtt/mqttClient.js';

const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors({ origin:['*','http://localhost:3000','https://servermqtt.vercel.app'] }));
app.use(express.json());

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
app.use('/api/auth', require('./routes/auth'));
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 