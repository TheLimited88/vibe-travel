'use client';

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
};

let app: any = null;

const getFirebaseApp = () => {
  try {
    if (!app) {
      const apps = getApps();
      if (apps.length === 0) {
        app = initializeApp(firebaseConfig);
      } else {
        app = apps[0];
      }
    }
    return app;
  } catch (error) {
    return null;
  }
};

export const auth = (() => {
  try {
    const firebaseApp = getFirebaseApp();
    return firebaseApp ? getAuth(firebaseApp) : null;
  } catch {
    return null;
  }
})();

export const db = (() => {
  try {
    const firebaseApp = getFirebaseApp();
    return firebaseApp ? getFirestore(firebaseApp) : null;
  } catch {
    return null;
  }
})();

export default app;
