import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map view when position changes
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
};

const LocationPicker = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [mapKey, setMapKey] = useState(0); // Force map re-render
  const mapRef = useRef(null);

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const newPosition = {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon)
        };
        
        setPosition(newPosition);
        setAddress(result.display_name);
        setMapKey(prev => prev + 1); // Force map re-render with new center
        
        // Send location data to parent
        if (onLocationSelect) {
          onLocationSelect({
            lat: newPosition.lat,
            lng: newPosition.lng,
            address: result.display_name,
            city: result.address?.city || result.address?.town || '',
            province: result.address?.state || result.address?.province || ''
          });
        }
      } else {
        alert('Location not found. Please try a different search.');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      alert('Error searching location. Please try again.');
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchLocation();
    }
  };

  const defaultCenter = { lat: 45.4215, lng: -75.6919 }; // Ottawa, Canada
  const mapCenter = position || defaultCenter;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Issue Location
        </label>
        
        {/* Search Box */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for an address or location..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={searchLocation}
            disabled={loading || !searchQuery.trim()}
            className="btn-primary"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {/* Map Container */}
        <div className="h-64 w-full border border-gray-300 rounded-lg overflow-hidden">
          <MapContainer
            key={mapKey} // Force re-render when key changes
            center={mapCenter}
            zoom={position ? 15 : 10}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <MapUpdater center={mapCenter} zoom={position ? 15 : 10} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {position && (
              <Marker position={position}>
                <Popup>Issue location</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Address Display */}
        {address && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Selected Location
            </label>
            <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md text-sm">
              {address}
            </div>
          </div>
        )}
        
        {!position && (
          <p className="mt-2 text-sm text-gray-500">
            Search for a location to place a marker on the map.
          </p>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
