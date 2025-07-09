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

const allowedOrigins = [
  'http://localhost:5173',
  'https://servermqtt.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); 
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

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
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 
