import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth } from '@/lib/firebaseAdminAuth';
import { recordArrival } from '@/lib/placeReviews';

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const decoded = await verifyRequestAuth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { slug } = await params;
    await recordArrival(decoded.uid, slug);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Record arrival error:', error);
    return NextResponse.json({ error: 'Failed to record arrival' }, { status: 500 });
  }
}
