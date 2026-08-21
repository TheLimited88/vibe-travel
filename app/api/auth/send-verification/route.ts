import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { checkRateLimit, rateLimitConfigs } from '@/lib/rateLimit';
import { getAdminDb } from '@/lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const allowed = checkRateLimit(clientIp, rateLimitConfigs.emailVerification);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { email, userId } = await request.json();

    if (!email || !userId) {
      return NextResponse.json(
        { error: 'Email and userId required' },
        { status: 400 }
      );
    }

    // Generate verification token (valid for 60 minutes)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 60 * 60 * 1000; // 60 minutes

    // Store token in Firestore
    await getAdminDb().collection('verification_tokens').doc(token).set({
      userId,
      email,
      createdAt: Date.now(),
      expiresAt,
      used: false,
    });

    // Build verification link from the actual request origin, not an env var
    // that can be unset/misconfigured in production
    const verifyLink = `${request.nextUrl.origin}/auth/verify-email?token=${token}`;

    // Send email via SendGrid
    const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #1a1a1a; line-height: 1.6; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                h1 { font-size: 24px; font-weight: 700; margin: 0 0 20px 0; color: #1a1a1a; }
                p { font-size: 14px; margin: 0 0 16px 0; color: #1a1a1a; }
                .button { display: inline-block; background-color: #0052CC; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin: 24px 0; }
                .footer { font-size: 13px; color: #666; margin-top: 32px; }
                .divider { height: 1px; background-color: #e0e0e0; margin: 24px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Verify Your Email</h1>

                <p>Hello,</p>

                <p>Please confirm your email address by clicking the button below. This link will take you to Vibe Travel so we can mark your account as verified.</p>

                <center>
                  <a href="${verifyLink}" class="button">Verify Email Address</a>
                </center>

                <p>If you didn't ask to verify this address, you can ignore this email.</p>

                <div class="divider"></div>

                <div class="footer">
                  <p>Thanks,<br>Vibe Travel team</p>
                  <p style="margin-top: 16px; color: #999; font-size: 12px;">This verification link expires in 60 minutes.</p>
                </div>
              </div>
            </body>
          </html>
        `;

    const sgMailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: process.env.SENDGRID_FROM_EMAIL, name: 'Vibe Travel' },
        subject: 'Verify Your Email',
        content: [
          { type: 'text/plain', value: `Verify your email by visiting: ${verifyLink}` },
          { type: 'text/html', value: emailHtml },
        ],
      }),
    });

    if (!sgMailResponse.ok) {
      const error = await sgMailResponse.text();
      console.error('SendGrid error:', error);
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Verification email sent' }, { status: 200 });
  } catch (error) {
    console.error('Send verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
