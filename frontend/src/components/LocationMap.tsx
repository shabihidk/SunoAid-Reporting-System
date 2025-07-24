// src/components/LocationMap.tsx

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define the icon outside the component to prevent re-creation on every render.
const defaultIcon = L.divIcon({
  html: `<div style="background-color: #3B82F6; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"></div>`,
  className: '', // Prevents Leaflet from adding its own styles
  iconSize: [25, 25],
  iconAnchor: [12, 25],
});

interface LocationMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation: [number, number] | null;
  height?: string;
}

/**
 * This is the key to the solution. This helper component uses hooks to safely
 * control the map's state AFTER it has been created, preventing re-initialization.
 */
function MapController({ selectedLocation, onLocationSelect }: LocationMapProps) {
  const map = useMap(); // Gets the existing map instance

  // This effect runs ONLY when selectedLocation changes.
  // It moves the map's view without re-rendering the whole container.
  useEffect(() => {
    if (selectedLocation) {
      map.setView(selectedLocation, 15); // Center and zoom the map
    }
  }, [selectedLocation, map]);

  // This hook handles map click events.
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return null; // This component does not render any visible elements.
}

const LocationMap: React.FC<LocationMapProps> = ({
  onLocationSelect,
  selectedLocation,
  height = '300px'
}) => {
  // Set a stable, default center for the map's very first load.
  const initialCenter: [number, number] = [12.8797, 121.7740]; // Philippines

  return (
    <div className="relative">
      <MapContainer
        // IMPORTANT: These props are only used for the initial creation.
        // The MapController handles all subsequent updates.
        center={selectedLocation || initialCenter}
        zoom={selectedLocation ? 15 : 5}
        style={{ height, width: '100%' }}
        className="rounded-md border border-gray-300"
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* The Marker for the selected location */}
        {selectedLocation && (
          <Marker position={selectedLocation} icon={defaultIcon} />
        )}

        {/* The controller component handles all dynamic updates safely */}
        <MapController
          selectedLocation={selectedLocation}
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>

      <div className="mt-2 text-sm text-gray-600">
        Click on the map to pin the exact location of the issue.
      </div>
    </div>
  );
};

export default LocationMap;