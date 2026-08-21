/**
 * Place Directions Component
 * Shows "Get Directions" button and handles geofence monitoring
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useGeofence } from '@/hooks/useGeofence';
import { useAuth } from '@/components/AuthProvider';

interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
}

interface PlaceDirectionsProps {
  place: Place;
  onArrived?: () => void;
}

export default function PlaceDirections({ place, onArrived }: PlaceDirectionsProps) {
  const { startMonitoring, checkArrivalOnReturn, status } = useGeofence();
  const { user } = useAuth();
  const [chooserOpen, setChooserOpen] = useState(false);
  const [arrivalToast, setArrivalToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isMonitoringRef = useRef(status.isMonitoring);
  isMonitoringRef.current = status.isMonitoring;
  const userRef = useRef(user);
  userRef.current = user;

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible' || !isMonitoringRef.current) return;

      checkArrivalOnReturn().then(async (arrived) => {
        if (!arrived) return;

        setArrivalToast(`You've arrived at ${place.name}`);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setArrivalToast(''), 2200);

        const currentUser = userRef.current;
        if (currentUser) {
          const token = await currentUser.getIdToken();
          await fetch(`/api/places/${encodeURIComponent(place.id)}/arrival`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          });
          onArrived?.();
        }
      });
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [checkArrivalOnReturn, place.name, place.id, onArrived]);

  const openNavApp = (url: string) => {
    window.open(url, '_blank');
    // Start geofence monitoring silently in background
    startMonitoring(place);
    setChooserOpen(false);
  };

  const handleOpenAppleMaps = () => {
    openNavApp(`https://maps.apple.com/?daddr=${place.lat},${place.lng}`);
  };

  const handleOpenGoogleMaps = () => {
    openNavApp(`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`);
  };

  return (
    <>
      <button
        onClick={() => setChooserOpen(true)}
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

      {chooserOpen && (
        <div
          onClick={() => setChooserOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10,10,10,0.4)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '375px',
              background: '#fff',
              borderRadius: '20px 20px 0 0',
              padding: '10px 16px 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <div style={{ width: '36px', height: '4px', background: 'rgba(10,10,10,0.15)', borderRadius: '999px', margin: '2px auto 12px' }} />
            <div
              style={{
                textAlign: 'center',
                fontSize: '13.5px',
                fontWeight: '700',
                color: '#0A0A0A',
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(10,10,10,0.08)',
                marginBottom: '6px',
              }}
            >
              Select Navigation App
            </div>
            <button
              onClick={handleOpenAppleMaps}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'none',
                border: 'none',
                padding: '14px 4px',
                fontSize: '14.5px',
                fontWeight: '600',
                color: '#0A0A0A',
                cursor: 'pointer',
              }}
            >
              Apple Maps<span>›</span>
            </button>
            <button
              onClick={handleOpenGoogleMaps}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'none',
                border: 'none',
                padding: '14px 4px',
                fontSize: '14.5px',
                fontWeight: '600',
                color: '#0A0A0A',
                borderTop: '1px solid rgba(10,10,10,0.08)',
                cursor: 'pointer',
              }}
            >
              Google Maps<span>›</span>
            </button>
            <button
              onClick={() => setChooserOpen(false)}
              style={{
                marginTop: '10px',
                background: 'rgba(10,10,10,0.05)',
                border: 'none',
                borderRadius: '12px',
                padding: '13px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'rgba(10,10,10,0.6)',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {arrivalToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#0A0A0A',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 600,
            zIndex: 1020,
          }}
        >
          {arrivalToast}
        </div>
      )}
    </>
  );
}
