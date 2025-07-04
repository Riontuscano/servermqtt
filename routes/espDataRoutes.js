import express from 'express';
import { getData, deleteByDate } from '../controllers/espDataController.js';
import EspData from '../models/EspData.js';

const router = express.Router();

router.get('/data', getData);
router.delete('/data/deleteByDate', deleteByDate);

// Delete all ESP data by MACID
router.delete('/data/deleteByMacId', async (req, res) => {
  const { macId } = req.body;
  try {
    const result = await EspData.deleteMany({ MACID: macId });
    res.json({ message: `${result.deletedCount} documents deleted for MACID ${macId}.` });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', details: err });
  }
});

export default router; 