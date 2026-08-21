import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth } from '@/lib/firebaseAdminAuth';
import { isSaved, getSaveCount, toggleSave } from '@/lib/savedPlaces';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const count = await getSaveCount(slug);

    const decoded = await verifyRequestAuth(request);
    if (!decoded) {
      return NextResponse.json({ signedIn: false, saved: false, count });
    }

    const saved = await isSaved(decoded.uid, slug);
    return NextResponse.json({ signedIn: true, saved, count });
  } catch (error) {
    console.error('Get save status error:', error);
    return NextResponse.json({ error: 'Failed to load save status' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const decoded = await verifyRequestAuth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { slug } = await params;
    const saved = await toggleSave(decoded.uid, slug);
    const count = await getSaveCount(slug);

    return NextResponse.json({ success: true, saved, count });
  } catch (error) {
    console.error('Toggle save error:', error);
    return NextResponse.json({ error: 'Failed to save place' }, { status: 500 });
  }
}
