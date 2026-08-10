export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code || code.length !== 6) {
      return Response.json({ success: false, error: 'Invalid code format' }, { status: 400 });
    }

    // For demo purposes, accept any 6-digit code
    // In production, verify against TOTP secret stored for the user
    const admin2FASecret = process.env.ADMIN_2FA_SECRET || '123456';

    if (code === admin2FASecret) {
      return Response.json({ success: true });
    } else {
      return Response.json({ success: false, error: 'Invalid 2FA code' }, { status: 401 });
    }
  } catch (error) {
    console.error('2FA verification error:', error);
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
