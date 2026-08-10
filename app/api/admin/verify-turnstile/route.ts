export async function POST(request: Request) {
  try {
    const { token, email, password } = await request.json();

    if (!token) {
      return Response.json({ success: false, error: 'No token provided' }, { status: 400 });
    }

    const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

    if (!secretKey) {
      return Response.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    // Verify token with Cloudflare
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      return Response.json({ success: false, error: 'Token verification failed' }, { status: 400 });
    }

    // Verify admin credentials (server-side)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@vibetravel.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123';

    if (email !== adminEmail || password !== adminPassword) {
      return Response.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Admin authentication error:', error);
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
