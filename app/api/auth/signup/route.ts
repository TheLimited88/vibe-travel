import { NextRequest, NextResponse } from 'next/server';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { checkRateLimit, rateLimitConfigs, getClientIP } from '@/lib/rateLimit';
import { verifyCaptcha, isSuspiciousScore } from '@/lib/captcha';

export async function POST(request: NextRequest) {
  try {
    const { email, password, captchaToken } = await request.json();
    const clientIP = getClientIP(request);

    // Validate input
    if (!email || !password || !captchaToken) {
      return NextResponse.json(
        { error: 'Email, password, and CAPTCHA token required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // ===== SECURITY LAYER 1: Rate Limiting =====
    if (!checkRateLimit(clientIP, rateLimitConfigs.signup)) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again in 1 hour.' },
        { status: 429, headers: { 'Retry-After': '3600' } }
      );
    }

    // ===== SECURITY LAYER 2: CAPTCHA Verification =====
    const captchaResult = await verifyCaptcha(captchaToken, clientIP);

    if (!captchaResult.success) {
      console.warn(`CAPTCHA verification failed for IP: ${clientIP}, errors: ${captchaResult.errorCodes?.join(', ')}`);
      return NextResponse.json(
        { error: 'CAPTCHA verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // ===== SECURITY LAYER 3: Check Risk Score =====
    if (captchaResult.score && isSuspiciousScore(captchaResult.score)) {
      console.warn(`Suspicious signup from ${clientIP}, CAPTCHA score: ${captchaResult.score}`);
      // In production, you might:
      // - Require additional verification
      // - Rate limit more aggressively
      // - Log to security monitoring
      // For now, allow but log
    }

    // ===== SECURITY LAYER 4: Create Account =====
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user in Firestore for lockout tracking
      await setDoc(doc(db, `users/${email.toLowerCase()}`), {
        id: user.uid,
        email: user.email,
        createdAt: new Date(),
        emailVerified: false,
        signupIP: clientIP,
        captchaScore: captchaResult.score || null,
      });

      // ===== SECURITY LAYER 5: Send Verification Email =====
      try {
        // Trigger verification email (using existing endpoint)
        await fetch(`${request.nextUrl.origin}/api/auth/send-verification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.uid,
            email: user.email,
          }),
        });
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        // Don't block signup if email fails
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Account created successfully. Please verify your email.',
          user: {
            id: user.uid,
            email: user.email,
          },
        },
        { status: 201 }
      );
    } catch (authError: any) {
      console.error('Auth error:', authError.code);

      // Handle specific Firebase errors
      if (authError.code === 'auth/email-already-in-use') {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        );
      }

      if (authError.code === 'auth/invalid-email') {
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 }
        );
      }

      if (authError.code === 'auth/weak-password') {
        return NextResponse.json(
          { error: 'Password is too weak' },
          { status: 400 }
        );
      }

      throw authError;
    }
  } catch (error) {
    console.error('Signup endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
