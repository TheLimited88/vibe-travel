import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

function getAdminApp(): App {
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

export function getAdminAuth(): Auth {
  if (!authInstance) {
    authInstance = getAuth(getAdminApp());
  }
  return authInstance;
}

// Verifies a Firebase ID token and returns the decoded token's uid, or null if invalid/expired.
export async function verifyIdToken(idToken: string): Promise<string | null> {
  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    return decoded.uid;
  } catch {
    return null;
  }
}
