import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth } from '@/lib/firebaseAdminAuth';
import { listSavedForUser } from '@/lib/savedPlaces';
import { getPlace } from '@/lib/places';

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyRequestAuth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const saves = await listSavedForUser(decoded.uid);
    const places = await Promise.all(saves.map((s) => getPlace(s.placeSlug)));

    const saved = saves
      .map((s, i) => ({ savedAt: s.savedAt, place: places[i] }))
      .filter((v) => v.place !== null)
      .sort((a, b) => b.savedAt - a.savedAt)
      .map((v) => ({ ...v.place, savedAt: v.savedAt }));

    return NextResponse.json({ success: true, places: saved });
  } catch (error) {
    console.error('List saved places error:', error);
    return NextResponse.json({ error: 'Failed to load saved places' }, { status: 500 });
  }
}
