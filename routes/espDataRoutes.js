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

// Delete all records with 0,0 coordinates
router.delete('/data/deleteInvalidCoordinates', async (req, res) => {
  try {
    const result = await EspData.deleteMany({
      $or: [
        { Latitude: 0, Longitude: 0 },
        { Latitude: null, Longitude: null },
        { Latitude: { $exists: false }, Longitude: { $exists: false } }
      ]
    });
    res.json({ message: `${result.deletedCount} documents with invalid coordinates deleted.` });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', details: err });
  }
});

export default router; 