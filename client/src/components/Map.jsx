import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Map({ data }) {
  // Calculate center point from data
  const center = data.length > 0 
    ? [data[0].Latitude || 0, data[0].Longitude || 0]
    : [0, 0];

  // Prepare polyline positions from data
  const polylinePositions = data
    .filter(point => point.Latitude && point.Longitude)
    .map(point => [point.Latitude, point.Longitude]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg bg-card">
      <MapContainer 
        center={center} 
        zoom={data.length > 0 ? 10 : 2} 
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Polyline for pet's walk route */}
        {polylinePositions.length > 1 && (
          <Polyline positions={polylinePositions} color="blue" />
        )}
        {data.map((point, index) => (
          <Marker 
            key={`${point._id}-${index}`} 
            position={[point.Latitude || 0, point.Longitude || 0]}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-semibold mb-2">ESP32 Data Point</h3>
                <p><strong>SIM:</strong> {point.SIM}</p>
                <p><strong>MAC ID:</strong> {point.MACID}</p>
                <p><strong>Battery:</strong> {point.Battery}%</p>
                <p><strong>Steps:</strong> {point.StepCount}</p>
                <p><strong>WiFi:</strong> {point.WiFi}</p>
                <p><strong>Signal:</strong> {point.Signal}</p>
                <p><strong>Breed Factor:</strong> {point.BreedFactor || 'N/A'}</p>
                <p><strong>Time:</strong> {new Date(point.createdAt).toLocaleString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
} 