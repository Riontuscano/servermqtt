import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import { connect as mqttConnect } from 'mqtt';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  ssl: true
});
const db = mongoose.connection;
db.once('open', () => console.log('MongoDB Connected'));
db.on('error', console.error);

const espDataSchema = new mongoose.Schema({
  SIM: String,
  MACID: String,
  Latitude: Number,
  Longitude: Number,
  Battery: Number,
  StepCount: Number,
  WiFi: String,
  Signal: String,
  SOS: Number,
  Reset: Number,
  BLE: Number,
  BreedFactor: Number, 
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const EspData = mongoose.model('EspData', espDataSchema);

const mqttUrl = 'mqtts://f948043422ce46d7ae62f9c7562028ae.s1.eu.hivemq.cloud:8883';
const mqttTopic = 'esp32/data';

const mqttClient = mqttConnect(mqttUrl, {
  username: 'esp32user',
  password: process.env.MQTT_PASSWORD
});

mqttClient.on('connect', () => {
  console.log('Connected to MQTT Broker');
  mqttClient.subscribe(mqttTopic, (err) => {
    if (!err) console.log(`Subscribed to topic: ${mqttTopic}`);
  });
});

mqttClient.on('message', async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log('📥 Received:', data);

    const doc = new EspData({
      SIM: data.SIM,
      MACID: data.MACID,
      Latitude: data.Latitude,
      Longitude: data.Longitude,
      Battery: data.Battery,
      StepCount: data["Step count"],
      WiFi: data.WiFi,
      Signal: data.Signal,
      SOS: data.SOS,
      Reset: data.Reset,
      BLE: data.BLE
    });

    await doc.save();
  } catch (err) {
    console.error('Error handling MQTT message:', err);
  }
});

app.get('/', (req, res) => {
  res.send('ESP32 Step & Sensor Backend is Running');
});

app.get('/api/data', async (req, res) => {
  try {
    const latest = await EspData.find().sort({ createdAt: -1 }).limit(50);
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
