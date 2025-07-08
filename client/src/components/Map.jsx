import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom icon with MACID label and green color for all markers
const createCustomIcon = (macId) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: bold;
        white-space: nowrap;
        margin-bottom: 5px;
        text-align: center;
      ">${macId}</div>
      <div style="
        width: 20px;
        height: 20px;
        background: #44ff44;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Component to handle marker clicks and zoom
function MarkerWithZoom({ point, index }) {
  const map = useMap();
  
  const handleMarkerClick = () => {
    map.setView([point.Latitude, point.Longitude], 16); // Zoom level 16 (3-4x zoom)
  };

  return (
    <Marker 
      key={`${point._id}-${index}`} 
      position={[point.Latitude || 0, point.Longitude || 0]}
      icon={createCustomIcon(point.MACID)}
      eventHandlers={{
        click: handleMarkerClick,
      }}
    >
      <Popup>
        <div className="text-sm">
          <p><strong>MAC ID:</strong> {point.MACID}</p>
          <p><strong>Name:</strong> {point.name || 'Pet Tracker'}</p>
          <p><strong>Location:</strong> {point.Latitude.toFixed(6)}, {point.Longitude.toFixed(6)}</p>
          <p><strong>Time:</strong> {new Date(point.createdAt).toLocaleString()}</p>
        </div>
      </Popup>
    </Marker>
  );
}

export default function Map({ data }) {
  // Calculate center point from data
  const center = data.length > 0 
    ? [data[0].Latitude || 0, data[0].Longitude || 0]
    : [0, 0];

  // Group data by MACID and create polylines for each device
  const polylinesByMacId = {};
  data.forEach(point => {
    if (point.Latitude && point.Longitude && point.MACID) {
      if (!polylinesByMacId[point.MACID]) {
        polylinesByMacId[point.MACID] = [];
      }
      polylinesByMacId[point.MACID].push([point.Latitude, point.Longitude]);
    }
  });

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
        {/* Polylines for each device's movement path */}
        {Object.entries(polylinesByMacId).map(([macId, positions]) => (
          positions.length > 1 && (
            <Polyline 
              key={macId}
              positions={positions} 
              color="blue" 
              weight={3}
              opacity={0.7}
            />
          )
        ))}
        {data.map((point, index) => (
          <MarkerWithZoom key={`${point._id}-${index}`} point={point} index={index} />
        ))}
      </MapContainer>
    </div>
  );
} 