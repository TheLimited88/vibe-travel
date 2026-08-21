import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { checkRateLimit, rateLimitConfigs, getClientIP } from '@/lib/rateLimit';
import { verifyCaptcha } from '@/lib/captcha';

export async function POST(request: NextRequest) {
  try {
    const { email, captchaToken } = await request.json();
    const clientIP = getClientIP(request);

    // Validate input
    if (!email || !captchaToken) {
      return NextResponse.json(
        { error: 'Email and CAPTCHA token required' },
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

    // ===== SECURITY LAYER 1: Rate Limiting (Per Email) =====
    // Use email as key to limit per email address, not per IP
    const emailKey = `password-reset-${email.toLowerCase()}`;
    if (!checkRateLimit(emailKey, rateLimitConfigs.passwordReset)) {
      return NextResponse.json(
        { error: 'Too many password reset attempts. Please try again in 1 hour.' },
        { status: 429, headers: { 'Retry-After': '3600' } }
      );
    }

    // ===== SECURITY LAYER 2: CAPTCHA Verification =====
    const captchaResult = await verifyCaptcha(captchaToken, clientIP);

    if (!captchaResult.success) {
      console.warn(`CAPTCHA verification failed for password reset from IP: ${clientIP}`);
      return NextResponse.json(
        { error: 'CAPTCHA verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // ===== SECURITY LAYER 3: Send Reset Email =====
    // Security note: We don't reveal whether email exists or not
    // Always return success message
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${request.nextUrl.origin}/auth/reset-password-form`,
      });

      console.log(`Password reset email sent to: ${email} from IP: ${clientIP}`);
    } catch (error: any) {
      // Don't reveal if email exists
      console.error('Password reset error:', error.code);

      // Handle specific errors silently
      if (error.code === 'auth/user-not-found') {
        // Still return success to avoid email enumeration
      } else {
        console.error('Unexpected password reset error:', error);
      }
    }

    // Always return success (security best practice)
    return NextResponse.json(
      {
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
