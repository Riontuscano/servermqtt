import Pet from '../models/Pet.js';

export const createPet = async (req, res) => {
  try {
    const { imageUrl, name, dob, user, macId } = req.body;
    const pet = new Pet({ imageUrl, name, dob, user, macId });
    await pet.save();
    res.status(201).json(pet);
  } catch (err) {
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