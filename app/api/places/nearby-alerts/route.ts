import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth } from '@/lib/firebaseAdminAuth';
import { checkNearbyNewPlaces } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyRequestAuth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const lat = typeof body.lat === 'number' ? body.lat : null;
    const lng = typeof body.lng === 'number' ? body.lng : null;
    if (lat == null || lng == null) {
      return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
    }

    const result = await checkNearbyNewPlaces(decoded.uid, lat, lng);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Nearby alerts check error:', error);
    return NextResponse.json({ error: 'Failed to check nearby places' }, { status: 500 });
  }
}
