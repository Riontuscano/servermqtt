import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  name: { type: String, required: true },
  breed: { type: String, required: true },
  dob: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  macId: { type: String, required: true },
  device: {
    name: String,
    macId: String
  },
  createdAt: { type: Date, default: Date.now }
});

const Pet = mongoose.model('Pet', petSchema);

export default Pet; 