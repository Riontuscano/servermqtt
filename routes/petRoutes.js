import express from 'express';
import { createPet, getPets, getPetById, updatePet, deletePet, getPetsByUser } from '../controllers/petController.js';
import { getEspDataByMacId, getMostRecentEspDataByMacId } from '../controllers/petEspDataController.js';

const router = express.Router();

router.post('/', createPet);
router.get('/', getPets);
router.get('/:id', getPetById);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);
router.get('/user/:userId', getPetsByUser);
router.get('/espdata/:macId', getEspDataByMacId);
router.get('/espdata/:macId/recent', getMostRecentEspDataByMacId);

export default router; 