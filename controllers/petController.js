import Pet from '../models/Pet.js';

export const createPet = async (req, res) => {
  console.log('--- createPet called ---');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  try {
    const { imageUrl, name, breed, dob, user, macId, device } = req.body;
    let parsedDevice = device;
    if (typeof device === 'string') {
      try {
        parsedDevice = JSON.parse(device);
      } catch (e) {
        console.error('Device JSON parse error:', e);
        parsedDevice = undefined;
      }
    }
    const pet = new Pet({ imageUrl, name, breed, dob, user, macId, device: parsedDevice });
    await pet.save();
    console.log('Pet saved:', pet);
    res.status(201).json(pet);
  } catch (err) {
    console.error('Error in createPet:', err);
    res.status(400).json({ error: err.message });
  }
};

export const getPets = async (req, res) => {
  try {
    const pets = await Pet.find().populate('user', 'fullName username email');
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('user', 'fullName username email');
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    res.json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    res.json({ message: 'Pet deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPetsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const pets = await Pet.find({ user: userId }).populate('user', 'fullName username email');
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 