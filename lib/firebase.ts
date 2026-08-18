import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { initializeFirestore, getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'fake-key-for-build',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'fake.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'fake-project',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1:web:1',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'fake.appspot.com',
};

function getFirebaseApp(): FirebaseApp {
  const apps = getApps();
  return apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
}

const app = getFirebaseApp();

// Real SDK instances — NOT lazy proxies. Firestore/Auth functions like doc(),
// collection(), and signInWithEmailAndPassword() validate their first argument
// with `instanceof Firestore` / `instanceof Auth`, which a Proxy wrapping a
// plain object fails, even though property access on it appears to work.
export const auth: Auth = getAuth(app);

// Server-side (API routes / Node) can't hold the WebSocket-style stream
// Firestore prefers, which surfaces as "client is offline" on first use.
// Force long-polling there; browsers keep the default, more efficient transport.
export const db: Firestore =
  typeof window === 'undefined'
    ? initializeFirestore(app, { experimentalForceLongPolling: true })
    : getFirestore(app);

export default app;
