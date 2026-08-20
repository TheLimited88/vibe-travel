export interface VerifiedUser {
  uid: string;
}

/**
 * Verifies a `Bearer <idToken>` header via Firebase's Identity Toolkit REST
 * API (accounts:lookup) rather than firebase-admin/auth — importing that
 * submodule crashes this project's serverless functions at cold-start
 * (confirmed twice: once via lib/firebaseAdmin.ts, once via this file).
 * This REST call needs only the existing public Firebase Web API key.
 */
export async function verifyRequestAuth(request: Request): Promise<VerifiedUser | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const idToken = authHeader.slice('Bearer '.length);
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    if (!res.ok) return null;

    const data = await res.json();
    const uid = data.users?.[0]?.localId;
    return uid ? { uid } : null;
  } catch {
    return null;
  }
}
