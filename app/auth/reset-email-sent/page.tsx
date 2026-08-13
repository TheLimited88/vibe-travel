'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetEmailSentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '123@gmail.com';
  const [resendLoading, setResendLoading] = useState(false);

  const handleResendEmail = () => {
    setResendLoading(true);
    console.log('Resend email to:', email);
    setTimeout(() => setResendLoading(false), 1000);
  };

  const handleOpenResetLink = () => {
    const timestamp = Date.now();
    router.push(`/auth/reset-password-form?email=${encodeURIComponent(email)}&timestamp=${timestamp}`);
  };

  const handleBackToSignIn = () => {
    router.push('/auth/signin');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#FFFFFF', paddingTop: '20px' }}>
      <div style={{ width: '100%', maxWidth: '335px', paddingLeft: '20px', paddingRight: '20px' }}>
        {/* Back Button */}
        <button
          onClick={() => router.push('/auth/signin')}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '999px',
            background: '#FFFFFF',
            border: '1px solid rgba(10,10,10,0.08)',
            cursor: 'pointer',
            padding: '0',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: '#0A0A0A',
          }}
        >
          ‹
        </button>

        {/* Logo */}
        <img
          src="/vibe-travel-logo-v2-cropped.png"
          alt="Vibe Travel"
          style={{
            height: '32px',
            width: 'auto',
            objectFit: 'contain',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '20px',
          }}
        />

        {/* Success Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center', textAlign: 'center', paddingTop: '8px' }}>
          {/* Checkmark Circle */}
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '999px',
            background: 'rgba(62,232,168,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            color: '#0A9B71',
          }}>
            ✓
          </div>

          {/* Heading */}
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#0A0A0A' }}>
            Check your email
          </div>

          {/* Message */}
          <div style={{ fontSize: '13px', color: 'rgba(10,10,10,0.55)', lineHeight: '1.5' }}>
            We've sent a password reset link to <strong style={{ color: '#0A0A0A' }}>{email}</strong>. Follow the link to choose a new password.
          </div>

          {/* Resend Email Button */}
          <button
            onClick={handleResendEmail}
            disabled={resendLoading}
            style={{
              background: 'none',
              border: 'none',
              color: '#6B3FD1',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '0',
              opacity: resendLoading ? 0.5 : 1,
            }}
          >
            Resend email
          </button>

          {/* Open Reset Link Button */}
          <button
            onClick={handleOpenResetLink}
            style={{
              background: '#3EE8A8',
              color: '#0A0A0A',
              border: 'none',
              borderRadius: '14px',
              padding: '13px 24px',
              fontSize: '14px',
              fontWeight: '700',
              marginTop: '8px',
              cursor: 'pointer',
            }}
          >
            Open reset link (demo)
          </button>

          {/* Back to Sign In Button */}
          <button
            onClick={handleBackToSignIn}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(10,10,10,0.5)',
              fontSize: '12.5px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '0',
            }}
          >
            Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
}
