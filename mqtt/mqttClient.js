import { connect as mqttConnect } from 'mqtt';
import dotenv from 'dotenv';
dotenv.config();
import { saveMqttData } from '../controllers/espDataController.js';

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
    // console.log('📥 Received:', data);
    await saveMqttData(data);
  } catch (err) {
    console.error('Error handling MQTT message:', err);
  }
});

export default mqttClient; 