'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    turnstile: any;
  }
}

export default function AdminSignInPage() {
  const router = useRouter();
  const turnstileRef = useRef<string | null>(null);
  const [authTab, setAuthTab] = useState<'signin' | 'create'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load Cloudflare Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setTurnstileLoaded(true);
      // Render Turnstile widget
      if (window.turnstile) {
        window.turnstile.render('#turnstile', {
          sitekey: process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITEKEY,
          theme: 'light',
        });
      }
    };
    document.head.appendChild(script);
  }, []);

  const handleTurnstileCallback = (token: string) => {
    turnstileRef.current = token;
  };

  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!turnstileRef.current) {
      alert('Please complete the CAPTCHA verification');
      setIsSubmitting(false);
      return;
    }

    try {
      // Send credentials and token to backend for verification
      const response = await fetch('/api/admin/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: turnstileRef.current,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store authentication token and redirect to 2FA
        localStorage.setItem('adminToken', 'authenticated');
        router.push('/admin/verify-2fa');
      } else {
        alert(data.error || 'Authentication failed. Please try again.');
        // Reset Turnstile
        if (window.turnstile) {
          window.turnstile.reset();
        }
        turnstileRef.current = null;
        setIsSubmitting(false);
      }
    } catch (error) {
      alert('Error authenticating. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#fff' }}>
      <div style={{ width: '100%', maxWidth: '375px', display: 'flex', flexDirection: 'column', padding: '58px 24px 24px', gap: '18px' }}>
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
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
          }}
        >
          ‹
        </button>

        {/* Header */}
        <div style={{ fontSize: '22px', fontWeight: '800', color: '#0A0A0A', textAlign: 'center' }}>
          Admin sign in
        </div>

        {/* Description */}
        <div style={{ fontSize: '12.5px', color: 'rgba(10,10,10,0.55)', textAlign: 'center' }}>
          Restricted to verified staff accounts. Access is logged.
        </div>

        {/* Auth Tabs */}
        <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid rgba(10,10,10,0.1)', paddingBottom: '12px' }}>
          <button
            onClick={() => setAuthTab('signin')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: authTab === 'signin' ? '700' : '400',
              color: authTab === 'signin' ? '#6B3FD1' : 'rgba(10,10,10,0.4)',
              cursor: 'pointer',
              borderBottom: authTab === 'signin' ? '2px solid #6B3FD1' : 'none',
              paddingBottom: '12px',
              marginBottom: '-12px',
            }}
          >
            Sign in
          </button>
          <button
            onClick={() => setAuthTab('create')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: authTab === 'create' ? '700' : '400',
              color: authTab === 'create' ? '#6B3FD1' : 'rgba(10,10,10,0.4)',
              cursor: 'pointer',
              borderBottom: authTab === 'create' ? '2px solid #6B3FD1' : 'none',
              paddingBottom: '12px',
              marginBottom: '-12px',
            }}
          >
            Create account
          </button>
        </div>

        {/* Sign In Form */}
        {authTab === 'signin' && (
          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Google Button */}
            <button
              type="button"
              style={{
                background: '#fff',
                border: '1px solid rgba(10,10,10,0.1)',
                borderRadius: '14px',
                padding: '13px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#0A0A0A',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#4285F4" opacity="0.1"/>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="bold" fill="#4285F4">
                  G
                </text>
              </svg>
              Continue with Google
            </button>

            {/* Apple Button */}
            <button
              type="button"
              style={{
                background: '#0A0A0A',
                border: 'none',
                borderRadius: '14px',
                padding: '13px',
                fontSize: '14px',
                fontWeight: '700',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.05 13.5c-.22-1.9 1.25-3.4 1.38-3.53-1.33-1.95-3.45-2.15-4.15-2.21-1.77-.2-3.47 1.04-4.38 1.04-.9 0-2.26-1-3.71-.97-1.9.03-3.66 1.1-4.65 2.8-1.98 3.43-.5 8.5 1.43 11.3 1 1.42 2.15 3 3.69 2.95 1.52-.05 2.1-.98 3.94-.98 1.84 0 2.37 1 3.95.98 1.55-.02 2.54-1.42 3.53-2.87 1.1-1.6 1.55-3.16 1.58-3.24-.05-.02-3.18-1.22-3.23-4.84z"/>
              </svg>
              Continue with Apple
            </button>

            {/* Divider */}
            <div style={{ textAlign: 'center', color: 'rgba(10,10,10,0.5)', fontSize: '12px' }}>or</div>

            {/* Email Input */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#0A0A0A', marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  border: '1px solid rgba(10,10,10,0.12)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  fontSize: '14px',
                  fontFamily: "'Inter',sans-serif",
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Password Input */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#0A0A0A', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid rgba(10,10,10,0.12)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  fontSize: '14px',
                  fontFamily: "'Inter',sans-serif",
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Password Requirements */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: 'rgba(10,10,10,0.6)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input type="checkbox" checked={passwordRequirements.length} readOnly style={{ cursor: 'default' }} />
                At least 8 characters
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input type="checkbox" checked={passwordRequirements.uppercase} readOnly style={{ cursor: 'default' }} />
                One uppercase letter
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input type="checkbox" checked={passwordRequirements.number} readOnly style={{ cursor: 'default' }} />
                One number
              </label>
            </div>

            {/* Forgot Password */}
            <div style={{ textAlign: 'right' }}>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B3FD1',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Cloudflare Turnstile */}
            {turnstileLoaded && (
              <div
                id="turnstile"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              />
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              style={{
                background: '#3EE8A8',
                color: '#0A0A0A',
                border: 'none',
                borderRadius: '14px',
                padding: '13px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Sign in
            </button>

            {/* Terms */}
            <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.6)', textAlign: 'center' }}>
              By signing in you agree to Vibe Travel's{' '}
              <span style={{ color: '#6B3FD1' }}>Terms of Service</span> and{' '}
              <span style={{ color: '#6B3FD1' }}>Privacy Policy</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
