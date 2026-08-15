# Geofence Push Notification Implementation Guide

## Overview
Vibe Travel monitors user location when they've requested directions to a Place. When the user enters the Place's proximity zone while moving toward it, a push notification alerts them of arrival.

## Trigger Specifications

### Distance Zones
- **Primary Detection Zone**: 150 meters
- **Extended Detection Zone**: Up to 200 meters (when GPS accuracy is degraded)

### Critical Safeguards
Push notifications are **only** triggered when ALL conditions are met:

1. ✅ **User initiated directions to that specific Place**
   - User tapped "Get Directions" from the Place detail view
   - Store active direction session: `{placeId, placeName, timestamp}`

2. ✅ **User is moving toward/approaching the Place**
   - Calculate velocity vector toward place coordinates
   - Reject if stationary (speed < 1 m/s)
   - Reject if moving away from place
   - Use bearing to validate approach angle (±45° cone)

3. ✅ **Location accuracy is acceptable**
   - Use GPS accuracy metric (horizontal_accuracy)
   - If accuracy > 150m: extend detection zone to 200m
   - If accuracy > 200m: suppress notification (too unreliable)
   - Recommend user to turn on high-accuracy location mode

4. ✅ **Notification not already sent**
   - Track sent notifications per place per session
   - Store: `{placeId, notificationSentAt}`
   - Reset when user leaves geofence (100m+ away for 5+ minutes)
   - Prevents duplicate notifications during loitering

## Implementation Architecture

### Location Monitoring Flow
```
User Opens App/PWA
    ↓
Check Active Direction Session
    ↓
Start Location Watch (every 5-10 seconds)
    ↓
Calculate Distance to Place
    ↓
Check All 4 Safeguards
    ↓
If All Pass → Trigger Push Notification
    ↓
Mark Notification as Sent
    ↓
Stop Location Watch (or continue monitoring)
```

### Data Structure
```typescript
interface DirectionSession {
  placeId: string;
  placeName: string;
  placeCoords: { lat: number; lng: number };
  initiatedAt: number;
  notificationSentAt?: number;
}

interface LocationUpdate {
  lat: number;
  lng: number;
  accuracy: number; // meters
  speed: number; // m/s
  bearing: number; // degrees (0-360)
  timestamp: number;
}

interface NotificationTrigger {
  meetsDistanceCheck: boolean;
  isApproaching: boolean;
  hasAcceptableAccuracy: boolean;
  notAlreadySent: boolean;
  shouldNotify: boolean; // true if ALL above are true
}
```

## Performance Considerations

- **Battery**: Use coarse location updates initially, switch to fine when < 500m
- **Frequency**: Every 5-10 seconds while in direction session (adjust based on accuracy)
- **Cleanup**: Stop monitoring after notification sent, or after 1 hour timeout
- **Network**: Cache place coordinates locally to avoid API calls during monitoring

## Testing Checklist

- [ ] User arrives at exact place coordinates → notification triggers
- [ ] User is 150m away but moving toward → notification triggers
- [ ] User is 160m away, high accuracy, moving toward → notification triggers
- [ ] User is 180m away, degraded accuracy (>150m), moving toward → notification triggers
- [ ] User is 210m away, degraded accuracy → notification does NOT trigger
- [ ] User is 150m away but moving away → notification does NOT trigger
- [ ] User is 150m away but stationary → notification does NOT trigger
- [ ] Second visit to same place → notification triggers again
- [ ] PWA and native app both trigger notifications

## Metrics to Monitor Post-Launch

- Notification accuracy (% of notifications within 150m of actual arrival)
- False positive rate (notifications when not actually at place)
- User engagement (% who tap notification vs. dismiss)
- Opt-out rate (how many disable geofence notifications)
- Battery impact (measure power consumption during monitoring)

## Future Enhancements

- Machine learning to detect common "false approach" patterns (e.g., driving past on highway)
- Personalized distance thresholds based on place type (small venue vs. large park)
- Integration with transit mode detection (notify differently for walking vs. driving)
- A/B test notification wording variations
