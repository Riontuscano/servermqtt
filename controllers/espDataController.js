import EspData from '../models/EspData.js';

export const getData = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const sortOrder = req.query.sort === 'asc' ? 1 : -1;
  try {
    const [docs, totalCount] = await Promise.all([
      EspData.find().sort({ createdAt: sortOrder }).skip(skip).limit(limit),
      EspData.countDocuments()
    ]);
    res.json({ docs, totalCount });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching data' });
  }
};

export const deleteByDate = async (req, res) => {
  const { from, to } = req.body;
  try {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const result = await EspData.deleteMany({
      createdAt: {
        $gte: fromDate,
        $lte: toDate
      }
    });
    res.json({ message: `${result.deletedCount} documents deleted.` });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', details: err });
  }
};

export const saveMqttData = async (data) => {
  try {
    // Log all incoming data from devices
    console.log('Received MQTT data:', data);
    const wifiValue = Number(data.WiFi);
    const signalValue = Number(data.Signal);

    const doc = new EspData({
      SIM: data.SIM,
      MACID: data.MACID,
      Latitude: data.Latitude,
      Longitude: data.Longitude,
      Battery: data.Battery,
      StepCount: data.StepCount,
      WiFi: isNaN(wifiValue) ? null : wifiValue,
      Signal: isNaN(signalValue) ? null : signalValue,
      SOS: data.SOS,
      Reset: data.Reset,
      BLE: data.BLE,
      BreedFactor: data.BreedFactor
    });
    await doc.save();
  } catch (err) {
    console.error('Error saving MQTT data:', err);
  }
}; 