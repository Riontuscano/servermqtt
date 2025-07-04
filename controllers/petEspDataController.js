import EspData from '../models/EspData.js';

export const getEspDataByMacId = async (req, res) => {
  const { macId } = req.params;
  try {
    const data = await EspData.find({ MACID: macId });
    const normalized = data.map(doc => ({
      ...doc.toObject(),
      WiFi: Number(doc.WiFi),
      Signal: Number(doc.Signal)
    }));
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMostRecentEspDataByMacId = async (req, res) => {
  const { macId } = req.params;
  try {
    const data = await EspData.findOne({ MACID: macId }).sort({ createdAt: -1 });
    if (!data) return res.status(404).json({ error: 'No data found for this MACID' });
    res.json({
      ...data.toObject(),
      WiFi: Number(data.WiFi),
      Signal: Number(data.Signal)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 