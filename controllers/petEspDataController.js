import EspData from '../models/EspData.js';

export const getEspDataByMacId = async (req, res) => {
  const { macId } = req.params;
  try {
    const data = await EspData.find({ MACID: macId });
    // Ensure WiFi and Signal are numbers in the response
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