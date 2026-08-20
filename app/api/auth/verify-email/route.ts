import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { checkRateLimit, rateLimitConfigs } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const allowed = checkRateLimit(clientIp, { maxAttempts: 10, windowMs: 60000 });
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    // Get token document from Firestore
    const adminDb = getAdminDb();
    const tokenRef = adminDb.collection('verification_tokens').doc(token);
    const tokenSnap = await tokenRef.get();

    if (!tokenSnap.exists) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    const tokenData = tokenSnap.data()!;

    // Check if token expired
    if (Date.now() > tokenData.expiresAt) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 });
    }

    // Check if token already used
    if (tokenData.used) {
      return NextResponse.json({ error: 'Token already used' }, { status: 400 });
    }

    // Mark token as used
    await tokenRef.update({ used: true, usedAt: Date.now() });

    // Update user document to mark email as verified
    await adminDb.collection('users').doc(tokenData.userId).update({
      emailVerified: true,
      emailVerifiedAt: Date.now(),
    });

    return NextResponse.json(
      { success: true, message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
