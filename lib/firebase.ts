import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

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
export const db: Firestore = getFirestore(app);

export default app;
