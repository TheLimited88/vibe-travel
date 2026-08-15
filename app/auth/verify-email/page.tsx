'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type VerificationStatus = 'verifying' | 'success' | 'error' | 'expired';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.error === 'Token expired') {
            setStatus('expired');
            setMessage('This verification link has expired. Please request a new one.');
          } else {
            setStatus('error');
            setMessage(data.error || 'Verification failed');
          }
          return;
        }

        setStatus('success');
        setMessage('✅ Email verified! Redirecting to home...');
        setTimeout(() => router.push('/'), 2000);
      } catch (error) {
        setStatus('error');
        setMessage('Verification failed. Please try again.');
        console.error('Verification error:', error);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '20px',
        padding: '20px',
        background: '#FFFFFF',
      }}
    >
      <div style={{ maxWidth: '400px', textAlign: 'center' }}>
        {status === 'verifying' && (
          <>
            <div
              style={{
                fontSize: '48px',
                marginBottom: '16px',
                animation: 'spin 2s linear infinite',
              }}
            >
              🔄
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0A0A0A', marginBottom: '8px' }}>
              Verifying Email
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0A9B71', marginBottom: '8px' }}>
              Email Verified!
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>❌</div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#C53855', marginBottom: '8px' }}>
              Verification Failed
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)', marginBottom: '20px' }}>{message}</p>
            <button
              onClick={() => router.push('/auth/signin')}
              style={{
                background: '#6B3FD1',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Back to Sign In
            </button>
          </>
        )}

        {status === 'expired' && (
          <>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>⏰</div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#F59E0B', marginBottom: '8px' }}>
              Link Expired
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)', marginBottom: '20px' }}>{message}</p>
            <button
              onClick={() => router.push('/auth/signin')}
              style={{
                background: '#6B3FD1',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Request New Link
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
