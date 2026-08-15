/**
 * Account lockout protection against brute force attacks
 * Locks account after N failed attempts for M minutes
 */

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface AccountLockStatus {
  isLocked: boolean;
  failedAttempts: number;
  lockedUntil?: number;
  lastAttempt?: number;
}

const FAILED_ATTEMPT_THRESHOLD = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const FAILED_ATTEMPTS_RESET_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get account lock status
 */
export async function getAccountLockStatus(userId: string): Promise<AccountLockStatus> {
  try {
    const lockDoc = await getDoc(doc(db, 'account_lockouts', userId));

    if (!lockDoc.exists()) {
      return { isLocked: false, failedAttempts: 0 };
    }

    const data = lockDoc.data();
    const now = Date.now();

    // Check if lockout has expired
    if (data.lockedUntil && now > data.lockedUntil) {
      // Lockout expired, remove it
      await updateDoc(doc(db, 'account_lockouts', userId), {
        isLocked: false,
        failedAttempts: 0,
        lockedUntil: null,
      });

      return { isLocked: false, failedAttempts: 0 };
    }

    // Check if failed attempts should reset
    if (data.lastAttempt && now - data.lastAttempt > FAILED_ATTEMPTS_RESET_MS) {
      await updateDoc(doc(db, 'account_lockouts', userId), {
        failedAttempts: 0,
        lastAttempt: now,
      });

      return { isLocked: false, failedAttempts: 0 };
    }

    return {
      isLocked: data.isLocked || false,
      failedAttempts: data.failedAttempts || 0,
      lockedUntil: data.lockedUntil,
      lastAttempt: data.lastAttempt,
    };
  } catch (error) {
    console.error('Error checking account lock status:', error);
    return { isLocked: false, failedAttempts: 0 };
  }
}

/**
 * Record failed login attempt
 */
export async function recordFailedAttempt(userId: string): Promise<AccountLockStatus> {
  try {
    const lockDoc = await getDoc(doc(db, 'account_lockouts', userId));
    const now = Date.now();
    let failedAttempts = 1;

    if (lockDoc.exists()) {
      const data = lockDoc.data();
      failedAttempts = (data.failedAttempts || 0) + 1;
    }

    const isLocked = failedAttempts >= FAILED_ATTEMPT_THRESHOLD;
    const lockoutData: any = {
      failedAttempts,
      lastAttempt: now,
      isLocked,
    };

    if (isLocked) {
      lockoutData.lockedUntil = now + LOCKOUT_DURATION_MS;
    }

    await setDoc(doc(db, 'account_lockouts', userId), lockoutData, { merge: true });

    return {
      isLocked,
      failedAttempts,
      lockedUntil: lockoutData.lockedUntil,
    };
  } catch (error) {
    console.error('Error recording failed attempt:', error);
    return { isLocked: false, failedAttempts: 0 };
  }
}

/**
 * Clear failed attempts on successful login
 */
export async function clearFailedAttempts(userId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'account_lockouts', userId), {
      failedAttempts: 0,
      isLocked: false,
      lockedUntil: null,
      lastAttempt: Date.now(),
    });
  } catch (error) {
    console.error('Error clearing failed attempts:', error);
  }
}

/**
 * Get lockout info for display to user
 */
export function getLockoutMessage(lockStatus: AccountLockStatus): string {
  if (!lockStatus.isLocked || !lockStatus.lockedUntil) {
    return '';
  }

  const remainingMs = lockStatus.lockedUntil - Date.now();
  const remainingMinutes = Math.ceil(remainingMs / 60000);

  return `Account temporarily locked. Try again in ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}.`;
}
