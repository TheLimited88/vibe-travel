/**
 * React Hook for Geofence Monitoring
 * Usage: const { startMonitoring, stopMonitoring, status } = useGeofence()
 */

import { useState, useCallback, useEffect } from 'react';
import { geofenceService, Place, DirectionSession } from '@/lib/geofenceService';
import { useFirebaseMessaging } from './useFirebaseMessaging';

export interface GeofenceStatus {
  isMonitoring: boolean;
  session: DirectionSession | null;
  lastUpdate: {
    distance: number;
    accuracy: number;
    isApproaching: boolean;
    timestamp: number;
  } | null;
}

export function useGeofence() {
  const [status, setStatus] = useState<GeofenceStatus>({
    isMonitoring: false,
    session: null,
    lastUpdate: null,
  });

  const { fcmToken } = useFirebaseMessaging();

  /**
   * Start monitoring for a Place
   */
  const startMonitoring = useCallback((place: Place) => {
    // Request notification permission if needed
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Start geofence monitoring
    geofenceService.startDirectionSession(place);

    setStatus((prev) => ({
      ...prev,
      isMonitoring: true,
      session: {
        placeId: place.id,
        placeName: place.name,
        placeCoords: { lat: place.lat, lng: place.lng },
        initiatedAt: Date.now(),
      },
    }));
  }, []);

  /**
   * Stop monitoring
   */
  const stopMonitoring = useCallback(() => {
    geofenceService.stopDirectionSession();
    setStatus({
      isMonitoring: false,
      session: null,
      lastUpdate: null,
    });
  }, []);

  /**
   * Update geofence service with FCM token
   */
  useEffect(() => {
    if (fcmToken) {
      geofenceService.setFcmTokens([fcmToken]);
    }
  }, [fcmToken]);

  /**
   * Poll for status updates
   */
  useEffect(() => {
    if (!status.isMonitoring) return;

    const interval = setInterval(() => {
      const sessionStatus = geofenceService.getSessionStatus();

      if (!sessionStatus.isActive) {
        setStatus({
          isMonitoring: false,
          session: null,
          lastUpdate: null,
        });
        return;
      }

      // Update status with latest info
      setStatus((prev) => ({
        ...prev,
        session: sessionStatus.session || prev.session,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [status.isMonitoring]);

  return {
    startMonitoring,
    stopMonitoring,
    status,
  };
}
