import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

const serviceAccount: ServiceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID || '',
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || '',
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
  client_email: process.env.FIREBASE_CLIENT_EMAIL || '',
  client_id: process.env.FIREBASE_CLIENT_ID || '',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
};

if (!admin.apps?.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

const messaging = admin.messaging();
const db = admin.firestore();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      placeId,
      placeName,
      userLat,
      userLng,
      accuracy,
      timestamp,
      fcmTokens,
    } = body;

    if (!placeId || !placeName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Log notification event to Firestore
    await db.collection('geofence-notifications').add({
      placeId,
      placeName,
      userLat,
      userLng,
      accuracy,
      timestamp: new Date(timestamp),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // If FCM tokens provided, send push notifications
    if (fcmTokens && Array.isArray(fcmTokens) && fcmTokens.length > 0) {
      const message = {
        notification: {
          title: 'Vibe Travel',
          body: `You have arrived at ${placeName}`,
        },
        data: {
          placeId,
          placeName,
          userLat: String(userLat),
          userLng: String(userLng),
          accuracy: String(accuracy),
        },
      };

      // Send to multiple tokens
      const response = await messaging.sendMulticast({
        ...message,
        tokens: fcmTokens,
      });

      console.log(`Geofence notification sent to ${response.successCount} devices`);

      return NextResponse.json(
        {
          success: true,
          message: `Notification sent to ${response.successCount}/${fcmTokens.length} devices`,
          logId: placeId,
        },
        { status: 200 }
      );
    }

    // Log event even without FCM tokens (for analytics)
    return NextResponse.json(
      {
        success: true,
        message: 'Geofence event logged',
        logId: placeId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Geofence notification error:', error);
    return NextResponse.json(
      { error: 'Failed to process geofence notification' },
      { status: 500 }
    );
  }
}
