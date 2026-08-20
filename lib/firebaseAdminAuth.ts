import { getAuth, type Auth, type DecodedIdToken } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebaseAdmin';

let authInstance: Auth | null = null;

function getAdminAuth(): Auth {
  if (!authInstance) {
    authInstance = getAuth(getAdminApp());
  }
  return authInstance;
}

/**
 * Verifies a `Bearer <idToken>` header and returns the decoded token
 * (contains `uid`), or null if missing/invalid.
 */
export async function verifyRequestAuth(request: Request): Promise<DecodedIdToken | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const idToken = authHeader.slice('Bearer '.length);
  try {
    return await getAdminAuth().verifyIdToken(idToken);
  } catch {
    return null;
  }
}
