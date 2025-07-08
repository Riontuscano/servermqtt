import mongoose from 'mongoose';

const espDataSchema = new mongoose.Schema({
  SIM: String,
  MACID: String,
  Latitude: Number,
  Longitude: Number,
  Battery: Number,
  StepCount: Number,
  WiFi: Number,
  Signal: Number,
  SOS: Number,
  Reset: Number,
  BLE: Number,
  BreedFactor: Number
}, { timestamps: true });

const EspData = mongoose.model('EspData', espDataSchema);

export default EspData; 