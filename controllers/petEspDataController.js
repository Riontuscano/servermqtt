import EspData from '../models/EspData.js';

function macMinus2(mac) {
  const macInt = parseInt(mac.replace(/:/g, ''), 16);
  const wifiMacInt = macInt - 2;
  let wifiMacHex = wifiMacInt.toString(16).padStart(12, '0').toUpperCase();
  return wifiMacHex.match(/.{1,2}/g).join(':');
}

export const getEspDataByMacId = async (req, res) => {
  const { macId } = req.params;
  try {
      const altMacId = macMinus2(macId);
      data = await EspData.find({ MACID: altMacId });

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

      const altMacId = macMinus2(macId);
      data = await EspData.findOne({ MACID: altMacId }).sort({ createdAt: -1 });
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