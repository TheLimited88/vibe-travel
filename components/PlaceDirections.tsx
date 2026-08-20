/**
 * Place Directions Component
 * Shows "Get Directions" button and handles geofence monitoring
 */

'use client';

import { useState } from 'react';
import { useGeofence } from '@/hooks/useGeofence';

interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface PlaceDirectionsProps {
  place: Place;
}

export default function PlaceDirections({ place }: PlaceDirectionsProps) {
  const { startMonitoring } = useGeofence();

  const handleGetDirections = () => {
    // Open directions in map app
    const mapsUrl = `https://maps.apple.com/?daddr=${place.lat},${place.lng}`;
    window.open(mapsUrl, '_blank');

    // Start geofence monitoring silently in background
    startMonitoring(place);
  };

  return (
    <button
      onClick={handleGetDirections}
      style={{
        width: '100%',
        padding: '13px',
        background: '#3EE8A8',
        color: '#0A0A0A',
        border: 'none',
        borderRadius: '14px',
        fontSize: '14.5px',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L4.5 20l7.5-4 7.5 4L12 2z" fill="#0A0A0A" />
      </svg>
      Open in Maps
    </button>
  );
}
