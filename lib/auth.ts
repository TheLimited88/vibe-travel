import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

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
    const response = await fetch('/api/auth/send-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
