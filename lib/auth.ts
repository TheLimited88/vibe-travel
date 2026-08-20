import { db, auth } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import {
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  type AuthProvider,
  type UserCredential,
} from 'firebase/auth';

// Firebase Auth's IndexedDB-backed persistence throws "Database is
// closing/hidden" during signInWithPopup on this environment — its internal
// pending-event bookkeeping reacts badly to a document.visibilitychange while
// the popup is open. Switching to sessionStorage-backed persistence just for
// the popup call avoids that code path entirely, since the bug is specific to
// the IndexedDB implementation. Restored to local (durable) persistence right
// after, so the resulting session still survives a browser restart.
export async function signInWithPopupRetry(provider: AuthProvider): Promise<UserCredential> {
  await setPersistence(auth, browserSessionPersistence);
  try {
    const result = await signInWithPopup(auth, provider);
    await setPersistence(auth, browserLocalPersistence);
    return result;
  } catch (err) {
    await setPersistence(auth, browserLocalPersistence);
    if (err instanceof Error && err.message.includes('Database is closing/hidden')) {
      return await signInWithPopup(auth, provider);
    }
    throw err;
  }
}

export async function checkEmailVerified(userId: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return false;
    }

    return userSnap.data().emailVerified === true;
  } catch (error) {
    console.error('Error checking email verification:', error);
    return false;
  }
}

export async function sendVerificationEmail(email: string, userId: string): Promise<boolean> {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    if (!idToken) {
      console.error('Error sending verification email: no signed-in user');
      return false;
    }

    const response = await fetch('/api/auth/send-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({ email, userId }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

export function requireEmailVerified(userId: string, action: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const isVerified = await checkEmailVerified(userId);
    if (!isVerified) {
      reject(new Error(`Email verification required to ${action}. Please verify your email first.`));
    } else {
      resolve();
    }
  });
}
