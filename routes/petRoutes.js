import express from 'express';
import upload from '../middleware/upload.js';
import { createPet, getPets, getPetById, updatePet, deletePet, getPetsByUser } from '../controllers/petController.js';
import { getEspDataByMacId, getMostRecentEspDataByMacId } from '../controllers/petEspDataController.js';

const router = express.Router();

// Image upload endpoint for frontend
router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
  res.json({ imageUrl: req.file.path });
});

// Main pet creation (JSON only)
router.post('/', createPet);
router.get('/', getPets);
router.get('/:id', getPetById);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);
router.get('/user/:userId', getPetsByUser);
router.get('/espdata/:macId', getEspDataByMacId);
router.get('/espdata/:macId/recent', getMostRecentEspDataByMacId);

export default router; 