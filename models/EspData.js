import mongoose from 'mongoose';

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

export default EspData; 