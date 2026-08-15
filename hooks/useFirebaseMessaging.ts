import { useEffect, useState } from 'react';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import app from '@/lib/firebase';

export function useFirebaseMessaging() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [messaging, setMessaging] = useState<Messaging | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if messaging is supported
    if (typeof window === 'undefined') return;

    try {
      const msg = getMessaging(app);
      setMessaging(msg);

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            // Get FCM token
            getToken(msg, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            })
              .then((token) => {
                if (token) {
                  setFcmToken(token);
                  // Store token for later use
                  localStorage.setItem('fcmToken', token);
                }
              })
              .catch((error) => {
                console.error('Error getting FCM token:', error);
                setIsSupported(false);
              });
          }
        });
      } else if ('Notification' in window && Notification.permission === 'granted') {
        // Already granted, get token
        getToken(msg, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        })
          .then((token) => {
            if (token) {
              setFcmToken(token);
              localStorage.setItem('fcmToken', token);
            }
          })
          .catch((error) => {
            console.error('Error getting FCM token:', error);
            setIsSupported(false);
          });
      }

      // Handle incoming messages when app is in foreground
      onMessage(msg, (payload) => {
        console.log('Message received in foreground:', payload);

        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(payload.notification?.title || 'Vibe Travel', {
            body: payload.notification?.body,
            icon: '/vibe-travel-icon.png',
          });
        }
      });
    } catch (error) {
      console.error('Firebase Messaging not supported:', error);
      setIsSupported(false);
    }
  }, []);

  return {
    fcmToken,
    messaging,
    isSupported,
  };
}
