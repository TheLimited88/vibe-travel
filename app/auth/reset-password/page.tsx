'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSendReset = () => {
    if (!email) {
      setError('');
      return;
    }

    if (email === 'rrrr') {
      setError('No account with this email.');
    } else {
      console.log('Reset link sent to:', email);
      setError('');
    }
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

        {/* Heading and Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0A0A0A', textAlign: 'center' }}>
            Reset your password
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(10,10,10,0.55)', textAlign: 'center', lineHeight: '1.5' }}>
            Enter the email on your account and we'll send you a link to reset your password.
          </div>
        </div>

        {/* Email Input */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.55)' }}>Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 13px',
              fontSize: '14px',
              border: `1px solid ${error ? '#D14545' : 'rgba(10,10,10,0.12)'}`,
              borderRadius: '10px',
              boxSizing: 'border-box',
              color: '#0A0A0A',
            }}
          />
        </label>

        {/* Error Message */}
        {error && (
          <div style={{ fontSize: '12.5px', color: '#D14545', marginBottom: '14px' }}>
            {error}
          </div>
        )}

        {/* Send Reset Link Button */}
        <button
          onClick={handleSendReset}
          style={{
            width: '100%',
            padding: '13px',
            fontSize: '14px',
            fontWeight: '700',
            border: 'none',
            background: '#3EE8A8',
            borderRadius: '14px',
            cursor: 'pointer',
            color: '#0A0A0A',
          }}
        >
          Send reset link
        </button>
      </div>
    </div>
  );
}
