import EspData from '../models/EspData.js';

function macMinus2(mac) {
  const macInt = parseInt(mac.replace(/:/g, ''), 16);
  const wifiMacInt = macInt - 2;
  let wifiMacHex = wifiMacInt.toString(16).padStart(12, '0').toUpperCase();
  return wifiMacHex.match(/.{1,2}/g).join(':');
}

export const getEspDataByMacId = async (req, res) => {
  const { macId } = req.params;
  console.log('--- getEspDataByMacId called ---');
  console.log('Searching for MACID:', macId);
  
  try {
    // Check how many documents exist for this MACID
    const count = await EspData.countDocuments({ MACID: macId });
    console.log(`Found ${count} documents for MACID: ${macId}`);
    
    let data = await EspData.find({ MACID: macId });
    if (!data || data.length === 0) {
      // Try with macId - 2
      const altMacId = macMinus2(macId);
      console.log('Trying alternative MACID:', altMacId);
      const altCount = await EspData.countDocuments({ MACID: altMacId });
      console.log(`Found ${altCount} documents for alternative MACID: ${altMacId}`);
      data = await EspData.find({ MACID: altMacId });
    }
    
    // Log all unique MACIDs in database for debugging
    const allMacIds = await EspData.distinct('MACID');
    console.log('All MACIDs in database:', allMacIds);
    
    const normalized = data.map(doc => ({
      ...doc.toObject(),
      WiFi: Number(doc.WiFi),
      Signal: Number(doc.Signal)
    }));
    console.log(`Returning ${normalized.length} documents`);
    res.json(normalized);
  } catch (err) {
    console.error('Error in getEspDataByMacId:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getMostRecentEspDataByMacId = async (req, res) => {
  const { macId } = req.params;
  try {
    let data = await EspData.findOne({ MACID: macId }).sort({ createdAt: -1 });
    if (!data) {
      // Try with macId - 2
      const altMacId = macMinus2(macId);
      data = await EspData.findOne({ MACID: altMacId }).sort({ createdAt: -1 });
    }
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