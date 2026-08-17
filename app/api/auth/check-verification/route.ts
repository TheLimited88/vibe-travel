import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { checkRateLimit, rateLimitConfigs } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const allowed = checkRateLimit(clientIp, rateLimitConfigs.emailVerification);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ verified: false }, { status: 200 });
    }

    const userData = userSnap.data();
    return NextResponse.json(
      { verified: userData.emailVerified === true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Check verification error:', error);
    return NextResponse.json(
      { error: 'Failed to check verification status' },
      { status: 500 }
    );
  }
}
