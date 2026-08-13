import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    // Get token document from Firestore
    const tokenRef = doc(db, 'verification_tokens', token);
    const tokenSnap = await getDoc(tokenRef);

    if (!tokenSnap.exists()) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    const tokenData = tokenSnap.data();

    // Check if token expired
    if (Date.now() > tokenData.expiresAt) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 });
    }

    // Check if token already used
    if (tokenData.used) {
      return NextResponse.json({ error: 'Token already used' }, { status: 400 });
    }

    // Mark token as used
    await updateDoc(tokenRef, { used: true, usedAt: Date.now() });

    // Update user document to mark email as verified
    const userRef = doc(db, 'users', tokenData.userId);
    await updateDoc(userRef, {
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
