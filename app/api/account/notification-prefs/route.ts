import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth } from '@/lib/firebaseAdminAuth';
import { getNotificationPrefs, setNotificationPrefs } from '@/lib/notifications';

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyRequestAuth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const prefs = await getNotificationPrefs(decoded.uid);
    return NextResponse.json({
      notifyNewPlaces: prefs?.notifyNewPlaces ?? false,
      hasToken: !!prefs?.fcmToken,
    });
  } catch (error) {
    console.error('Get notification prefs error:', error);
    return NextResponse.json({ error: 'Failed to load notification preferences' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyRequestAuth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const updates: { notifyNewPlaces?: boolean; fcmToken?: string | null } = {};
    if (typeof body.notifyNewPlaces === 'boolean') updates.notifyNewPlaces = body.notifyNewPlaces;
    if (typeof body.fcmToken === 'string' || body.fcmToken === null) updates.fcmToken = body.fcmToken;

    await setNotificationPrefs(decoded.uid, updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Set notification prefs error:', error);
    return NextResponse.json({ error: 'Failed to save notification preferences' }, { status: 500 });
  }
}
