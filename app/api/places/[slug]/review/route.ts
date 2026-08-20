import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth } from '@/lib/firebaseAdminAuth';
import { createReviewOnce, getReview, getReviewSummary, hasArrived } from '@/lib/placeReviews';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const summary = await getReviewSummary(slug);

  const decoded = await verifyRequestAuth(request);
  if (!decoded) {
    return NextResponse.json({ signedIn: false, hasArrived: false, review: null, summary });
  }

  const [arrived, review] = await Promise.all([hasArrived(decoded.uid, slug), getReview(decoded.uid, slug)]);

  return NextResponse.json({ signedIn: true, hasArrived: arrived, review, summary });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const decoded = await verifyRequestAuth(request);
  if (!decoded) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { slug } = await params;

  const arrived = await hasArrived(decoded.uid, slug);
  if (!arrived) {
    return NextResponse.json({ error: 'Visit this place before rating it' }, { status: 403 });
  }

  const existing = await getReview(decoded.uid, slug);
  if (existing) {
    return NextResponse.json({ error: 'You already reviewed this place' }, { status: 409 });
  }

  const body = await request.json();
  const thumbsUp = body.thumbsUp === true;
  const vibeTags: string[] = Array.isArray(body.vibeTags) ? body.vibeTags.filter((t: unknown) => typeof t === 'string').slice(0, 2) : [];

  const created = await createReviewOnce(decoded.uid, slug, thumbsUp, vibeTags);
  if (!created) {
    return NextResponse.json({ error: 'You already reviewed this place' }, { status: 409 });
  }

  const summary = await getReviewSummary(slug);
  return NextResponse.json({ success: true, summary });
}
