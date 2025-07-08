import EspData from '../models/EspData.js';

function macMinus2(mac) {
  const macInt = parseInt(mac.replace(/:/g, ''), 16);
  const wifiMacInt = macInt - 2;
  let wifiMacHex = wifiMacInt.toString(16).padStart(12, '0').toUpperCase();
  return wifiMacHex.match(/.{1,2}/g).join(':');
}

export const getEspDataByMacId = async (req, res) => {
  let { macId } = req.params;
  macId = macId.trim();
  console.log('--- getEspDataByMacId called ---');
  console.log('Searching for MACID:', macId);
  try {
    // Case-insensitive search using regex, sorted by newest first
    let data = await EspData.find({ MACID: new RegExp(`^${macId}$`, 'i') }).sort({ createdAt: -1 });
    console.log('Found:', data.length, 'records for MACID:', macId);
    if (!data || data.length === 0) {
      // Try with macId - 2
      const altMacId = macMinus2(macId);
      console.log('Trying alternative MACID:', altMacId);
      data = await EspData.find({ MACID: new RegExp(`^${altMacId}$`, 'i') }).sort({ createdAt: -1 });
      console.log('Found:', data.length, 'records for alternative MACID:', altMacId);
    }
    // Log all unique MACIDs in database for debugging
    const allMacIds = await EspData.distinct('MACID');
    console.log('All MACIDs in database:', allMacIds);
    const normalized = data.map(doc => ({
      ...doc.toObject(),
      WiFi: Number(doc.WiFi),
      Signal: Number(doc.Signal)
      // createdAt and updatedAt are now handled by Mongoose timestamps
    }));
    console.log(`Returning ${normalized.length} documents`);
    res.json(normalized);
  } catch (err) {
    console.error('Error in getEspDataByMacId:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getMostRecentEspDataByMacId = async (req, res) => {
  let { macId } = req.params;
  macId = macId.trim();
  try {
    let data = await EspData.findOne({ MACID: new RegExp(`^${macId}$`, 'i') }).sort({ createdAt: -1 });
    if (!data) {
      // Try with macId - 2
      const altMacId = macMinus2(macId);
      data = await EspData.findOne({ MACID: new RegExp(`^${altMacId}$`, 'i') }).sort({ createdAt: -1 });
    }
    if (!data) return res.status(404).json({ error: 'No data found for this MACID' });
    res.json({
      ...data.toObject(),
      WiFi: Number(data.WiFi),
      Signal: Number(data.Signal)
      // createdAt and updatedAt are now handled by Mongoose timestamps
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 