import { db, auth } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithPopup, type AuthProvider, type UserCredential } from 'firebase/auth';

// Firebase Auth's IndexedDB persistence layer occasionally throws "Database is
// closing/hidden" on the first signInWithPopup attempt — a known SDK race tied
// to the popup momentarily changing document.visibilityState. Retrying once
// resolves it in practice, since persistence has already re-initialized.
export async function signInWithPopupRetry(provider: AuthProvider): Promise<UserCredential> {
  try {
    return await signInWithPopup(auth, provider);
  } catch (err) {
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
