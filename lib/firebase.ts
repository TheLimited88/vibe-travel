'use client';

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'fake-key-for-build',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'fake.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'fake-project',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1:web:1',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'fake.appspot.com',
};

let app: any;
let authInstance: any;
let dbInstance: any;

const getFirebaseApp = () => {
  try {
    if (!app) {
      const apps = getApps();
      if (apps.length > 0) {
        app = apps[0];
      } else if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        app = initializeApp(firebaseConfig);
      }
    }
  } catch (error) {
    console.error('Firebase init error:', error);
  }
  return app;
};

export const auth = new Proxy({}, {
  get: () => {
    if (!authInstance && getFirebaseApp()) {
      authInstance = getAuth(getFirebaseApp());
    }
    return authInstance;
  }
}) as any;

export const db = new Proxy({}, {
  get: () => {
    if (!dbInstance && getFirebaseApp()) {
      dbInstance = getFirestore(getFirebaseApp());
    }
    return dbInstance;
  }
}) as any;

export default app;
