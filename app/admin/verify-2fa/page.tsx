'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Admin2FAPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = code.length === 6 && /^\d{6}$/.test(code);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      // Verify 2FA code
      const response = await fetch('/api/admin/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success) {
        // Store authentication token and 2FA verified status
        localStorage.setItem('adminToken', 'authenticated');
        localStorage.setItem('admin2FAVerified', 'true');
        router.push('/admin/places');
      } else {
        alert(data.error || '2FA verification failed. Please try again.');
        setCode('');
        setIsSubmitting(false);
      }
    } catch (error) {
      alert('Error verifying 2FA. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#fff' }}>
      <div style={{ width: '100%', maxWidth: '375px', display: 'flex', flexDirection: 'column', padding: '58px 24px 24px', gap: '18px' }}>
        {/* Back Button */}
        <button
          onClick={() => router.push('/admin/signin')}
          aria-label="Back"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '999px',
            background: '#fff',
            border: '1px solid rgba(10,10,10,0.08)',
            alignSelf: 'flex-start',
            cursor: 'pointer',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ‹
        </button>

        {/* Heading */}
        <div style={{ fontSize: '22px', fontWeight: '800', color: '#0A0A0A', textAlign: 'center' }}>
          Two-factor verification
        </div>

        {/* Description */}
        <div style={{ fontSize: '12.5px', color: 'rgba(10,10,10,0.55)', textAlign: 'center' }}>
          Open Google Authenticator and enter the 6-digit code for Vibe Travel Admin.
        </div>

        {/* Code Input */}
        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={handleCodeChange}
            placeholder="123456"
            style={{
              border: '1px solid rgba(10,10,10,0.12)',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '20px',
              letterSpacing: '6px',
              textAlign: 'center',
              fontFamily: 'inherit',
              color: '#0A0A0A',
              boxSizing: 'border-box',
            }}
          />

          {/* Verify Button */}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            style={{
              background: '#3EE8A8',
              color: '#0A0A0A',
              border: 'none',
              borderRadius: '14px',
              padding: '13px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: isValid && !isSubmitting ? 'pointer' : 'not-allowed',
              opacity: isValid ? 1 : 0.5,
            }}
          >
            Verify & continue
          </button>
        </form>
      </div>
    </div>
  );
}
