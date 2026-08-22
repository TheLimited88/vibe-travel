import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth } from '@/lib/firebaseAdminAuth';
import { deleteAccountData, deleteFirebaseAuthUser } from '@/lib/accountDeletion';

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyRequestAuth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Clean up Firestore first, while the caller's session is still valid —
    // deleteFirebaseAuthUser makes any further verifyRequestAuth call for
    // this uid fail, since the account itself is gone.
    await deleteAccountData(decoded.uid);
    await deleteFirebaseAuthUser(decoded.uid);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
