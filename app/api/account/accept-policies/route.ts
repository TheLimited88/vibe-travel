import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth } from '@/lib/firebaseAdminAuth';
import { acceptPolicies, POLICY_PAGES, type PolicyPage } from '@/lib/policyAcceptance';

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyRequestAuth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const pages: PolicyPage[] = Array.isArray(body.pages)
      ? body.pages.filter((p: unknown): p is PolicyPage => POLICY_PAGES.includes(p as PolicyPage))
      : [];
    if (!pages.length) {
      return NextResponse.json({ error: 'pages must include at least one of: terms, privacy' }, { status: 400 });
    }

    await acceptPolicies(decoded.uid, pages);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Accept policies error:', error);
    return NextResponse.json({ error: 'Failed to record acceptance' }, { status: 500 });
  }
}
