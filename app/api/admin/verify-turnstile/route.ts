import { checkRateLimit, rateLimitConfigs } from '@/lib/rateLimit';
import { getAccountLockStatus, recordFailedAttempt, clearFailedAttempts } from '@/lib/accountLockout';
import { verifyCaptcha } from '@/lib/captcha';

export async function POST(request: Request) {
  try {
    const { token, email, password } = await request.json();
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userId = email || 'admin-unknown';

    // 1. Check rate limiting by email
    const allowed = checkRateLimit(email, rateLimitConfigs.signin);
    if (!allowed) {
      return Response.json(
        { success: false, error: 'Too many signin attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // 2. Check account lockout
    const lockStatus = await getAccountLockStatus(userId);
    if (lockStatus.isLocked && lockStatus.lockedUntil) {
      const remainingMs = lockStatus.lockedUntil - Date.now();
      const minutesRemaining = Math.ceil(remainingMs / 60000);
      return Response.json(
        { success: false, error: `Account locked. Try again in ${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}.` },
        { status: 429 }
      );
    }

    // 3. Verify CAPTCHA token and check suspicious score
    if (!token) {
      await recordFailedAttempt(userId);
      return Response.json({ success: false, error: 'No token provided' }, { status: 400 });
    }

    const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    if (!secretKey) {
      return Response.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    const captchaVerified = await verifyCaptcha(token, clientIp);
    if (!captchaVerified) {
      await recordFailedAttempt(userId);
      return Response.json({ success: false, error: 'CAPTCHA verification failed' }, { status: 400 });
    }

    // 4. Verify admin credentials
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('Admin credentials not configured');
      return Response.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    if (email !== adminEmail || password !== adminPassword) {
      await recordFailedAttempt(userId);
      return Response.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // 5. Success - clear failed attempts
    await clearFailedAttempts(userId);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Admin authentication error:', error);
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
