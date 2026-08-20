/**
 * Geofence Service for Place Arrival Detection
 * Monitors user location and triggers notifications when arriving at Places
 */

export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface LocationUpdate {
  lat: number;
  lng: number;
  accuracy: number; // meters
  speed: number; // m/s
  bearing: number; // degrees (0-360)
  timestamp: number;
}

export interface DirectionSession {
  placeId: string;
  placeName: string;
  placeCoords: { lat: number; lng: number };
  initiatedAt: number;
  notificationSentAt?: number;
  lastLocation?: LocationUpdate;
}

// Constants
const PRIMARY_ZONE = 150; // meters
const EXTENDED_ZONE = 200; // meters (degraded GPS)
const DEGRADED_ACCURACY_THRESHOLD = 150; // meters
const APPROACH_BEARING_CONE = 45; // degrees (±45° from place bearing)
const MIN_APPROACH_SPEED = 1; // m/s
const ROUTE_DEVIATION_THRESHOLD = 100; // meters
const LEAVE_GEOFENCE_DISTANCE = 100; // meters
const LEAVE_GEOFENCE_TIME = 300000; // 5 minutes

export class GeofenceService {
  private directionSession: DirectionSession | null = null;
  private locationWatch: number | null = null;
  private lastLocationUpdate: LocationUpdate | null = null;
  private leftGeofenceAt: number | null = null;
  private fcmTokens: string[] = [];

  /**
   * Start monitoring location for a specific Place
   */
  startDirectionSession(place: Place) {
    this.directionSession = {
      placeId: place.id,
      placeName: place.name,
      placeCoords: { lat: place.lat, lng: place.lng },
      initiatedAt: Date.now(),
    };

    this.startLocationMonitoring();
  }

  /**
   * Stop monitoring location
   */
  stopDirectionSession() {
    if (this.locationWatch) {
      navigator.geolocation.clearWatch(this.locationWatch);
      this.locationWatch = null;
    }
    this.directionSession = null;
    this.leftGeofenceAt = null;
  }

  /**
   * Start watching user location
   */
  private startLocationMonitoring() {
    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000,
    };

    this.locationWatch = navigator.geolocation.watchPosition(
      (position) => this.handleLocationUpdate(position),
      (error) => console.error('Geolocation error:', error),
      options
    );
  }

  /**
   * Handle location updates
   */
  private handleLocationUpdate(position: GeolocationPosition) {
    const update: LocationUpdate = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      speed: position.coords.speed || 0,
      bearing: position.coords.heading || 0,
      timestamp: Date.now(),
    };

    this.lastLocationUpdate = update;

    if (!this.directionSession) return;

    // Check all safeguards
    const trigger = this.checkNotificationTrigger(update);

    if (trigger.shouldNotify) {
      this.triggerNotification(this.fcmTokens);
    }

    // Check if user left geofence
    this.checkIfLeftGeofence(update);
  }

  /**
   * Check all 4 safeguards for notification trigger
   */
  private checkNotificationTrigger(update: LocationUpdate): {
    meetsDistanceCheck: boolean;
    isApproaching: boolean;
    hasAcceptableAccuracy: boolean;
    notAlreadySent: boolean;
    shouldNotify: boolean;
  } {
    if (!this.directionSession) {
      return {
        meetsDistanceCheck: false,
        isApproaching: false,
        hasAcceptableAccuracy: false,
        notAlreadySent: false,
        shouldNotify: false,
      };
    }

    // Safeguard 1: Check distance
    const distance = this.calculateDistance(
      update.lat,
      update.lng,
      this.directionSession.placeCoords.lat,
      this.directionSession.placeCoords.lng
    );

    const meetsDistanceCheck = this.checkDistanceZone(distance, update.accuracy);

    // Safeguard 2: Check if approaching
    const isApproaching = this.checkIfApproaching(update);

    // Safeguard 3: Check accuracy
    const hasAcceptableAccuracy =
      update.accuracy <= EXTENDED_ZONE &&
      update.accuracy > 0;

    // Safeguard 4: Not already sent
    const notAlreadySent = !this.directionSession.notificationSentAt;

    const shouldNotify =
      meetsDistanceCheck &&
      isApproaching &&
      hasAcceptableAccuracy &&
      notAlreadySent;

    return {
      meetsDistanceCheck,
      isApproaching,
      hasAcceptableAccuracy,
      notAlreadySent,
      shouldNotify,
    };
  }

  /**
   * Safeguard 1: Check if user is in distance zone
   */
  private checkDistanceZone(distance: number, accuracy: number): boolean {
    // If accuracy is degraded, allow up to EXTENDED_ZONE
    if (accuracy > DEGRADED_ACCURACY_THRESHOLD) {
      return distance <= EXTENDED_ZONE;
    }
    // Otherwise use PRIMARY_ZONE
    return distance <= PRIMARY_ZONE;
  }

  /**
   * Safeguard 2: Check if user is moving toward place
   */
  private checkIfApproaching(update: LocationUpdate): boolean {
    // Must have minimum speed
    if (update.speed < MIN_APPROACH_SPEED) {
      return false;
    }

    if (!this.directionSession || !this.lastLocationUpdate) {
      return false;
    }

    // Calculate distance at this location
    const currentDistance = this.calculateDistance(
      update.lat,
      update.lng,
      this.directionSession.placeCoords.lat,
      this.directionSession.placeCoords.lng
    );

    // Calculate distance at last location
    const lastDistance = this.calculateDistance(
      this.lastLocationUpdate.lat,
      this.lastLocationUpdate.lng,
      this.directionSession.placeCoords.lat,
      this.directionSession.placeCoords.lng
    );

    // Check if distance decreased (moving toward)
    const isMovingCloser = currentDistance < lastDistance;

    // Check bearing toward place
    const bearing = this.calculateBearing(
      update.lat,
      update.lng,
      this.directionSession.placeCoords.lat,
      this.directionSession.placeCoords.lng
    );

    const bearingDiff = this.angleDifference(update.bearing, bearing);
    const isCorrectBearing = bearingDiff <= APPROACH_BEARING_CONE;

    return isMovingCloser && isCorrectBearing;
  }

  /**
   * Check if user left the geofence
   */
  private checkIfLeftGeofence(update: LocationUpdate) {
    if (!this.directionSession) return;

    const distance = this.calculateDistance(
      update.lat,
      update.lng,
      this.directionSession.placeCoords.lat,
      this.directionSession.placeCoords.lng
    );

    if (distance > LEAVE_GEOFENCE_DISTANCE) {
      if (!this.leftGeofenceAt) {
        this.leftGeofenceAt = Date.now();
      }

      // If left geofence for 5+ minutes, reset notification flag
      if (
        Date.now() - this.leftGeofenceAt > LEAVE_GEOFENCE_TIME &&
        this.directionSession.notificationSentAt
      ) {
        this.directionSession.notificationSentAt = undefined;
      }
    } else {
      // Back in geofence
      this.leftGeofenceAt = null;
    }
  }

  /**
   * One-shot check: is this location within the active session's geofence?
   * Used when the app regains focus (e.g. returning from a maps app).
   */
  checkArrival(lat: number, lng: number, accuracy: number): boolean {
    if (!this.directionSession) return false;

    const distance = this.calculateDistance(
      lat,
      lng,
      this.directionSession.placeCoords.lat,
      this.directionSession.placeCoords.lng
    );

    return this.checkDistanceZone(distance, accuracy);
  }

  /**
   * Trigger push notification via Firebase
   */
  triggerNotification(fcmTokens?: string[]) {
    if (!this.directionSession) return;

    this.directionSession.notificationSentAt = Date.now();

    // Send to backend for Firebase Cloud Messaging
    this.sendNotificationViaFirebase(fcmTokens);
  }

  /**
   * Send notification via Firebase Cloud Messaging
   */
  private sendNotificationViaFirebase(fcmTokens?: string[]) {
    if (!this.directionSession || !this.lastLocationUpdate) return;

    const payload = {
      placeId: this.directionSession.placeId,
      placeName: this.directionSession.placeName,
      userLat: this.lastLocationUpdate.lat,
      userLng: this.lastLocationUpdate.lng,
      accuracy: this.lastLocationUpdate.accuracy,
      timestamp: Date.now(),
      fcmTokens: fcmTokens || [],
    };

    fetch('/api/events/geofence-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Geofence notification sent via Firebase');
        } else {
          console.error('Failed to send notification:', response.statusText);
        }
      })
      .catch((err) => console.error('Failed to send notification:', err));
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Calculate bearing from one coordinate to another
   */
  private calculateBearing(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const dLng = this.toRad(lng2 - lng1);
    const y = Math.sin(dLng) * Math.cos(this.toRad(lat2));
    const x =
      Math.cos(this.toRad(lat1)) * Math.sin(this.toRad(lat2)) -
      Math.sin(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.cos(dLng);

    return (Math.atan2(y, x) * 180) / Math.PI + 360;
  }

  /**
   * Calculate difference between two bearings (in degrees)
   */
  private angleDifference(bearing1: number, bearing2: number): number {
    let diff = Math.abs(bearing1 - bearing2);
    if (diff > 180) {
      diff = 360 - diff;
    }
    return diff;
  }

  /**
   * Convert degrees to radians
   */
  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Set FCM tokens for notification delivery
   */
  setFcmTokens(tokens: string[]) {
    this.fcmTokens = tokens;
  }

  /**
   * Get current session status
   */
  getSessionStatus() {
    return {
      isActive: !!this.directionSession,
      session: this.directionSession,
      lastLocation: this.lastLocationUpdate,
    };
  }
}

// Export singleton instance
export const geofenceService = new GeofenceService();
