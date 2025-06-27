import express from 'express';
import { getData, deleteByDate } from '../controllers/espDataController.js';

const router = express.Router();

router.get('/data', getData);
router.delete('/data/deleteByDate', deleteByDate);

export default router; 