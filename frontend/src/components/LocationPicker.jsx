import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Issue location</Popup>
    </Marker>
  );
}

const LocationPicker = ({ onLocationSelect, initialPosition = null }) => {
  const [position, setPosition] = useState(initialPosition);
  const [userLocation, setUserLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          if (!initialPosition) {
            setPosition(userPos);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to a general location if geolocation fails
          const defaultPos = { lat: 45.4215, lng: -75.6919 }; // Ottawa, Canada
          setUserLocation(defaultPos);
          if (!initialPosition) {
            setPosition(defaultPos);
          }
        }
      );
    }
  }, [initialPosition]);

  // Reverse geocoding to get address from coordinates
  const getAddressFromCoords = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
        if (onLocationSelect) {
          onLocationSelect({
            lat,
            lng,
            address: data.display_name,
            city: data.address?.city || data.address?.town || data.address?.village || '',
            province: data.address?.state || data.address?.province || ''
          });
        }
      }
    } catch (error) {
      console.error('Error getting address:', error);
      setAddress('Address not found');
    }
    setLoading(false);
  };

  // Update address when position changes
  useEffect(() => {
    if (position) {
      getAddressFromCoords(position.lat, position.lng);
    }
  }, [position]);

  const handleUseCurrentLocation = () => {
    if (userLocation) {
      setPosition(userLocation);
    }
  };

  const mapCenter = position || userLocation || { lat: 45.4215, lng: -75.6919 };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Issue Location
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Click on the map to select the exact location of the issue, or use your current location.
        </p>
        
        {/* Map Container */}
        <div className="h-64 w-full border border-gray-300 rounded-lg overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
        </div>

        {/* Controls */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="btn-secondary text-sm"
            disabled={!userLocation}
          >
            Use Current Location
          </button>
          
          {position && (
            <div className="text-sm text-gray-600">
              Coordinates: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
            </div>
          )}
        </div>

        {/* Address Display */}
        {loading && (
          <div className="mt-2 text-sm text-gray-600">
            Getting address...
          </div>
        )}
        
        {address && !loading && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-md text-sm">
              {address}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
