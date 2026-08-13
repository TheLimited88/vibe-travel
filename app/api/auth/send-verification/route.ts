import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
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
    await setDoc(
      doc(db, 'verification_tokens', token),
      {
        userId,
        email,
        createdAt: Date.now(),
        expiresAt,
        used: false,
      }
    );

    // Build verification link
    const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`;

    // Send email via SendGrid
    const sgMailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: process.env.SENDGRID_FROM_EMAIL },
        subject: 'Verify Your Email',
        html: `
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
        `,
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
