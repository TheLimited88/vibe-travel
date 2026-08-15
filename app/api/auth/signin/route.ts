import { NextRequest, NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { checkRateLimit, rateLimitConfigs, getClientIP } from '@/lib/rateLimit';
import { getAccountLockStatus, recordFailedAttempt, clearFailedAttempts, getLockoutMessage } from '@/lib/accountLockout';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const clientIP = getClientIP(request);

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // ===== SECURITY LAYER 1: Rate Limiting =====
    if (!checkRateLimit(clientIP, rateLimitConfigs.signin)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in 1 minute.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    // ===== SECURITY LAYER 2: Account Lockout Check =====
    // Note: We use email as key since user might not exist yet
    // In production, you'd lookup user by email first
    const emailKey = `account-${email.toLowerCase()}`;
    try {
      // Try to get user from Firestore to check lockout
      const usersQuery = await getDoc(doc(db, `users/${email.toLowerCase()}`));
      if (usersQuery.exists()) {
        const userId = usersQuery.data().id;
        const lockStatus = await getAccountLockStatus(userId);

        if (lockStatus.isLocked) {
          return NextResponse.json(
            { error: getLockoutMessage(lockStatus) },
            { status: 429, headers: { 'Retry-After': String(Math.ceil((lockStatus.lockedUntil || 0 - Date.now()) / 1000)) } }
          );
        }
      }
    } catch (error) {
      console.error('Error checking account lockout:', error);
      // Continue with authentication attempt
    }

    // ===== SECURITY LAYER 3: Authenticate =====
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ===== SECURITY LAYER 4: Clear Failed Attempts on Success =====
      try {
        // Store user reference for future lockout checks
        const userDoc = doc(db, `users/${email.toLowerCase()}`);
        const userData = await getDoc(userDoc);
        if (userData.exists()) {
          await clearFailedAttempts(user.uid);
        }
      } catch (clearError) {
        console.error('Error clearing failed attempts:', clearError);
        // Don't block signin if cleanup fails
      }

      // Return success with session info
      return NextResponse.json(
        {
          success: true,
          user: {
            id: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
          },
          message: 'Signed in successfully',
        },
        { status: 200 }
      );
    } catch (authError: any) {
      // ===== SECURITY LAYER 5: Record Failed Attempt =====
      try {
        const userDoc = doc(db, `users/${email.toLowerCase()}`);
        const userData = await getDoc(userDoc);
        if (userData.exists()) {
          const userId = userData.data().id;
          const lockStatus = await recordFailedAttempt(userId);

          // If newly locked, inform user
          if (lockStatus.isLocked) {
            return NextResponse.json(
              {
                error: getLockoutMessage(lockStatus),
                lockedUntil: lockStatus.lockedUntil,
              },
              { status: 429 }
            );
          }
        }
      } catch (recordError) {
        console.error('Error recording failed attempt:', recordError);
      }

      // Generic error message (don't reveal if email exists)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Signin endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
