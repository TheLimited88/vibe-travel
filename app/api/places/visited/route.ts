import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth } from '@/lib/firebaseAdminAuth';
import { listArrivalsForUser } from '@/lib/placeReviews';
import { getPlace } from '@/lib/places';

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyRequestAuth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const arrivals = await listArrivalsForUser(decoded.uid);
    const places = await Promise.all(arrivals.map((a) => getPlace(a.placeSlug)));

    const visited = arrivals
      .map((a, i) => ({ arrivedAt: a.arrivedAt, place: places[i] }))
      .filter((v) => v.place !== null)
      .sort((a, b) => b.arrivedAt - a.arrivedAt)
      .map((v) => ({ ...v.place, arrivedAt: v.arrivedAt }));

    return NextResponse.json({ success: true, places: visited });
  } catch (error) {
    console.error('List visited places error:', error);
    return NextResponse.json({ error: 'Failed to load visited places' }, { status: 500 });
  }
}
