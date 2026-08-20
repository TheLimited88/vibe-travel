import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let dbInstance: Firestore | null = null;

export function getAdminApp(): App {
  const apps = getApps();
  if (apps.length > 0) return apps[0];

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set');
  }

  const serviceAccount = JSON.parse(serviceAccountJson);

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

// Lazy singleton — initialized on first real use inside a request handler,
// not at module load, so builds don't require the secret to be present.
export function getAdminDb(): Firestore {
  if (!dbInstance) {
    dbInstance = getFirestore(getAdminApp());
    // gRPC's persistent streaming connections don't play well with Vercel's
    // frozen/reused serverless containers — reads through a resumed stale
    // connection can silently return outdated data. REST transport makes
    // every call a fresh HTTP request instead, which is reliable here.
    dbInstance.settings({ preferRest: true });
  }
  return dbInstance;
}
