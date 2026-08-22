import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth } from '@/lib/firebaseAdminAuth';
import { sendArrivalPush } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyRequestAuth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const placeName = typeof body.placeName === 'string' ? body.placeName : 'your destination';

    // The caller's client-side geofence detection already decided a real
    // arrival happened — this only re-checks the user's own opt-in and owns
    // the actual send, using this user's own stored token. Client-supplied
    // tokens are never trusted as a send target.
    const result = await sendArrivalPush(decoded.uid, placeName);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Geofence notification error:', error);
    return NextResponse.json({ error: 'Failed to send geofence notification' }, { status: 500 });
  }
}
