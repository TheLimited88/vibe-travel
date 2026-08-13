import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
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
