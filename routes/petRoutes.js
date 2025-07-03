import express from 'express';
import { createPet, getPets, getPetById, updatePet, deletePet, getPetsByUser } from '../controllers/petController.js';

const router = express.Router();

router.post('/', createPet);
router.get('/', getPets);
router.get('/:id', getPetById);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);
router.get('/user/:userId', getPetsByUser);

export default router; 