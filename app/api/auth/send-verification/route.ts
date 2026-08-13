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
        subject: 'Verify Your Vibe Travel Email',
        html: `
          <h2 style="color: #0A0A0A; margin-bottom: 16px;">Verify Your Email</h2>
          <p style="color: #0A0A0A; font-size: 14px; line-height: 1.5;">Hello,</p>
          <p style="color: #0A0A0A; font-size: 14px; line-height: 1.5;">Please confirm your email address by clicking the button below. This link will take you to Vibe Travel so we can mark your account as verified.</p>
          <p style="margin: 24px 0;">
            <a href="${verifyLink}" style="background-color: #6B3FD1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600;">Verify Email Address</a>
          </p>
          <p style="color: #666; font-size: 12px;">This link expires in 60 minutes.</p>
          <p style="color: #0A0A0A; font-size: 14px; line-height: 1.5;">If you didn't ask to verify this address, you can ignore this email.</p>
          <p style="color: #0A0A0A; font-size: 14px; margin-top: 24px;">Thanks,<br><strong>Vibe Travel team</strong></p>
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
