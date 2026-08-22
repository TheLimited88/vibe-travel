import { createSign } from 'crypto';
import { getAdminDb } from '@/lib/firebaseAdmin';

const DELETED_USER_SENTINEL = 'deleted-user';

interface ServiceAccount {
  client_email: string;
  private_key: string;
  project_id: string;
}

function base64url(input: Buffer | string): string {
  return (Buffer.isBuffer(input) ? input : Buffer.from(input))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Exchanges the service account for a short-lived OAuth2 access token via the
// standard JWT-bearer grant, using only Node's built-in crypto — importing
// firebase-admin/auth crashes this project's serverless functions at cold
// start (see lib/firebaseAdminAuth.ts), so admin-level user deletion goes
// through this same "plain REST" approach instead.
async function getServiceAccountAccessToken(serviceAccount: ServiceAccount, scope: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const signInput = `${header}.${claims}`;
  const signature = createSign('RSA-SHA256').update(signInput).sign(serviceAccount.private_key);
  const jwt = `${signInput}.${base64url(signature)}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to obtain service account access token: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.access_token as string;
}

// Deletes the Firebase Auth user by uid using the Identity Toolkit's
// admin-privileged REST endpoint (service-account authorized), which does
// not require the caller's own idToken to be freshly issued — unlike
// self-service deletion via the client SDK, which throws
// auth/requires-recent-login for sessions older than ~5 minutes.
export async function deleteFirebaseAuthUser(uid: string): Promise<void> {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set');
  }
  const serviceAccount: ServiceAccount = JSON.parse(serviceAccountJson);
  const accessToken = await getServiceAccountAccessToken(
    serviceAccount,
    'https://www.googleapis.com/auth/identitytoolkit'
  );

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${serviceAccount.project_id}/accounts:delete`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ localId: uid }),
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to delete Firebase Auth user: ${res.status} ${await res.text()}`);
  }
}

// Removes the deleted user's personal data. Reviews and arrivals stay
// attached to their places (place rating/review aggregates are computed by
// counting these documents, so deleting them would silently skew a place's
// stats) but are disassociated from the account by blanking the uid field —
// no display name is ever read back from these documents, so there's nothing
// further to anonymize.
export async function deleteAccountData(uid: string): Promise<void> {
  const db = getAdminDb();
  const writes: Promise<unknown>[] = [
    db.collection('users').doc(uid).delete(),
    db.collection('notificationPrefs').doc(uid).delete(),
  ];

  const [savedSnap, sentSnap, reviewsSnap, arrivalsSnap] = await Promise.all([
    db.collection('savedPlaces').where('uid', '==', uid).get(),
    db.collection('sentPlaceNotifications').where('uid', '==', uid).get(),
    db.collection('placeReviews').where('uid', '==', uid).get(),
    db.collection('placeArrivals').where('uid', '==', uid).get(),
  ]);

  savedSnap.forEach((doc) => writes.push(doc.ref.delete()));
  sentSnap.forEach((doc) => writes.push(doc.ref.delete()));
  reviewsSnap.forEach((doc) => writes.push(doc.ref.update({ uid: DELETED_USER_SENTINEL })));
  arrivalsSnap.forEach((doc) => writes.push(doc.ref.update({ uid: DELETED_USER_SENTINEL })));

  await Promise.all(writes);
}
