import { initializeApp, getApps } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

let auth: Auth | null = null;
let db: Firestore | null = null;

const initializeFirebase = () => {
  if (getApps().length === 0) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    return app;
  }
  return getApps()[0];
};

export const getAuthInstance = (): Auth => {
  if (!auth) {
    initializeFirebase();
  }
  return auth!;
};

export const getDbInstance = (): Firestore => {
  if (!db) {
    initializeFirebase();
  }
  return db!;
};

export const auth_lazy = () => getAuthInstance();
export const db_lazy = () => getDbInstance();
