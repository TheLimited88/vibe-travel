import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAuth } from '@/lib/firebaseAdminAuth';
import { getPolicyStatus } from '@/lib/policyAcceptance';

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyRequestAuth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const status = await getPolicyStatus(decoded.uid);
    return NextResponse.json(status);
  } catch (error) {
    console.error('Policy status check error:', error);
    return NextResponse.json({ error: 'Failed to check policy status' }, { status: 500 });
  }
}
