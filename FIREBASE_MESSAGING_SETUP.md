# Firebase Cloud Messaging Setup Guide

This guide sets up production-ready push notifications for geofence arrival alerts using Firebase Cloud Messaging (FCM).

## Architecture

```
User Opens App (PWA/Native)
    ↓
useFirebaseMessaging hook initializes FCM
    ↓
Gets FCM token + requests notification permission
    ↓
Geofence monitoring starts
    ↓
User enters proximity zone (150m) while approaching
    ↓
Geofence service triggers notification check
    ↓
Notification sent to backend (/api/events/geofence-notification)
    ↓
Firebase Admin SDK sends via FCM to device
    ↓
Service worker receives message in background
    ↓
Push notification displays on lock screen
```

## Setup Steps

### 1. Get Firebase Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **vibe-travel-11f50**
3. Navigate to **Project Settings** (gear icon) → **Service Accounts**
4. Click **Generate New Private Key** (Python/Node.js)
5. This downloads a JSON file with credentials

### 2. Add Environment Variables

Add these to `.env.local`:

```bash
# Firebase Admin SDK (from service account JSON)
FIREBASE_PROJECT_ID=vibe-travel-11f50
FIREBASE_PRIVATE_KEY_ID=<key_id from JSON>
FIREBASE_PRIVATE_KEY="<private_key from JSON>"
FIREBASE_CLIENT_EMAIL=<client_email from JSON>
FIREBASE_CLIENT_ID=<client_id from JSON>

# Firebase Web Push (VAPID key)
NEXT_PUBLIC_FIREBASE_VAPID_KEY=<get from Firebase Console>
```

### 3. Get VAPID Key for Web Push

1. In Firebase Console, go to **Messaging** tab
2. Click **"Create Cloud Messaging credentials"** or find existing key
3. Copy the **Public Key** (Web Push certificate key)
4. Add to `.env.local` as `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

### 4. Update Service Worker Config

Edit `public/firebase-messaging-sw.js` and replace placeholder config:

```javascript
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY_FROM_ENV',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'vibe-travel-11f50',
  appId: 'YOUR_APP_ID_FROM_ENV',
};
```

### 5. Install Firebase Admin SDK

```bash
npm install firebase-admin
```

## How It Works

### Client Side (Browser)

1. **useFirebaseMessaging.ts**:
   - Initializes Firebase Messaging
   - Requests notification permission
   - Gets FCM token from Firebase
   - Handles foreground notifications

2. **useGeofence.ts**:
   - Passes FCM token to geofence service
   - Starts location monitoring

### Server Side (Backend)

1. **geofenceService.ts**:
   - Monitors user location
   - Checks 4 safeguards
   - Calls `/api/events/geofence-notification` with FCM token

2. **app/api/events/geofence-notification/route.ts**:
   - Receives geofence trigger
   - Logs event to Firestore
   - Sends push via Firebase Admin SDK

### Service Worker

1. **public/firebase-messaging-sw.js**:
   - Receives messages in background
   - Shows notification on lock screen
   - Handles notification clicks

## Testing

### Test Foreground Notification (App Open)

1. Start dev server: `npm run dev`
2. Open PWA
3. Grant notification permission when prompted
4. Go to a Place and tap "Get Directions"
5. Manually approach coordinates in browser console:
   ```javascript
   // Set fake location to test (in browser console)
   const place = {id: 'test', name: 'Dead Horse Bay', lat: 40.5731, lng: -73.9712};
   ```

### Test Background Notification (App Closed)

1. Install PWA to home screen
2. Close browser completely
3. Approach location in real world
4. Notification appears on lock screen

### Check Firebase Console

1. Go to **Cloud Messaging** in Firebase Console
2. Send test notification to your device
3. Verify it appears on lock screen

## Metrics & Monitoring

### Track in Firestore

All geofence notifications logged to `geofence-notifications` collection:
- `placeId`, `placeName`
- `userLat`, `userLng`, `accuracy`
- `timestamp`, `createdAt`

### Dashboard Query

```javascript
// Get all arrival notifications this week
db.collection('geofence-notifications')
  .where('createdAt', '>=', new Date(Date.now() - 7*24*60*60*1000))
  .orderBy('createdAt', 'desc')
  .get()
```

## Troubleshooting

### "FCM token not available"
- Ensure `NEXT_PUBLIC_FIREBASE_VAPID_KEY` is set
- Check notification permission in browser settings
- Verify Firebase project is enabled

### "Notification not received"
- Check Firebase Console → Cloud Messaging → Send test message
- Verify service worker is registered: DevTools → Application → Service Workers
- Check browser console for errors

### "Private key error"
- Ensure `FIREBASE_PRIVATE_KEY` has escaped newlines
- In `.env.local`, use: `"-----BEGIN PRIVATE KEY-----\n...content...\n-----END PRIVATE KEY-----\n"`
- Or use JSON format without escaping

## Production Checklist

- [ ] Firebase Admin SDK credentials in `.env.local`
- [ ] VAPID key configured
- [ ] Service worker registered at `/firebase-messaging-sw.js`
- [ ] Geofence notification endpoint tested
- [ ] Foreground notifications working (app open)
- [ ] Background notifications working (app closed)
- [ ] Firestore rules allow logging geofence events
- [ ] Monitor false positive rate
- [ ] Set up battery monitoring for location tracking
