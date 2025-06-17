import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, Clock } from 'lucide-react';

const MqttLocationList = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get('http://localhost:5500/api/locations');
        setLocations(res.data);
      } catch (err) {
        console.error('Error fetching location data:', err);
      }
    };

    fetchLocations();
    const interval = setInterval(fetchLocations, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">
          🌍 ESP32 Location Stream
        </h1>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 max-h-[75vh] overflow-y-auto">
          {locations.length === 0 ? (
            <p className="text-center text-gray-500">No location data available...</p>
          ) : (
            <ul className="space-y-4">
              {locations.map((item, index) => (
                <li
                  key={index}
                  className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-blue-700 font-semibold">
                      <MapPin className="w-5 h-5" />
                      Topic: <span className="text-gray-700">{item.topic}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-gray-800">
                    <strong>Latitude:</strong> {item.lat} <br />
                    <strong>Longitude:</strong> {item.lng} <br />
                  </p>
                  <a
                    href={`https://maps.google.com/?q=${item.lat},${item.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-blue-600 hover:underline text-sm"
                  >
                    📍 View on Google Maps
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MqttLocationList;
