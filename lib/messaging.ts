'use client';

import { getMessaging, getToken, isSupported } from 'firebase/messaging';
import app from '@/lib/firebase';

export async function requestFcmToken(): Promise<string | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return null;
  if (!(await isSupported())) return null;

  try {
    const registration = await navigator.serviceWorker.ready;
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    return token || null;
  } catch (error) {
    console.error('Failed to get FCM token:', error);
    return null;
  }
}
