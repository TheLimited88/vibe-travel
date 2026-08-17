export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code || code.length !== 6) {
      return Response.json({ success: false, error: 'Invalid code format' }, { status: 400 });
    }

    const admin2FASecret = process.env.ADMIN_2FA_SECRET;

    if (!admin2FASecret) {
      console.error('2FA secret not configured');
      return Response.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

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
