
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import { connect as mqttConnect } from 'mqtt';
import mongoose from 'mongoose';

const { connect: dbConnect, connection, Schema, model } = mongoose;
const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors({
  origin: 'http://localhost:5173'
}));

dbConnect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = connection;
db.once('open', () => console.log('✅ Connected to MongoDB Atlas'));
db.on('error', console.error);

const mqttLocationSchema = new Schema({
  topic: String,
  lat: Number,
  lng: Number,
  accuracy: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const MqttLocation = model('MqttLocation', mqttLocationSchema);

const mqttUrl = 'mqtts://f948043422ce46d7ae62f9c7562028ae.s1.eu.hivemq.cloud:8883';
const client = mqttConnect(mqttUrl, {
  username: 'esp32user',
  password: process.env.MQTT_PASSWORD
});

const mqttTopic = 'esp32/location';

client.on('connect', () => {
  console.log('📡 Connected to HiveMQ');
  client.subscribe(mqttTopic, (err) => {
    if (!err) {
      console.log(`🟢 Subscribed to topic: ${mqttTopic}`);
    }
  });
});

client.on('message', async (topic, message) => {
  const msg = message.toString();
  console.log(`📥 ${topic}: ${msg}`);

  try {
    const { lat, lng, accuracy } = JSON.parse(msg);
    const entry = new MqttLocation({ topic, lat, lng, accuracy });
    await entry.save();
    console.log('✅ Location data saved to MongoDB');
  } catch (err) {
    console.error('❌ Error parsing/saving MQTT message:', err);
  }
});

app.get('/', (req, res) => {
  res.send('🌍 ESP32 Location Tracker Backend Running');
});

app.get('/api/locations', async (req, res) => {
  try {
    const data = await MqttLocation.find().sort({ createdAt: -1 }).limit(50);
    res.json(data);
  } catch (err) {
    console.error('❌ Error fetching location data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
