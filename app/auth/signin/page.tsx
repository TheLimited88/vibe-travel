'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { ensureUserDoc } from '@/lib/ensureUserDoc';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const has8Chars = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  // Load Cloudflare Turnstile script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    document.head.appendChild(script);
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Get CAPTCHA token from Turnstile
      const turnstile = (window as any).turnstile;
      if (!turnstile) {
        setError('Security check not loaded. Please refresh the page.');
        setIsLoading(false);
        return;
      }

      const token = turnstile.getResponse();
      if (!token) {
        setError('Please complete the security check');
        setIsLoading(false);
        return;
      }

      // Call secure signin API
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          captchaToken: token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Sign in failed');
        // Reset CAPTCHA on error
        turnstile?.reset?.();
        setIsLoading(false);
        return;
      }

      // Success — the API route already verified credentials/rate limits;
      // sign in client-side too so a real Firebase Auth session is established
      // (this is what the rest of the app actually reads via onAuthStateChanged).
      if (data.success) {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      await ensureUserDoc(result.user, 'Google');
      router.push('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign-in failed';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      const result = await signInWithPopup(auth, provider);
      await ensureUserDoc(result.user, 'Apple');
      router.push('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Apple sign-in failed';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#FFFFFF', paddingTop: '20px' }}>
      <div style={{ width: '100%', maxWidth: '335px', paddingLeft: '20px', paddingRight: '20px' }}>
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
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

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '18px', marginBottom: '28px', borderBottom: '1px solid rgba(10,10,10,0.08)', paddingBottom: '9px' }}>
          <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0A0A0A', cursor: 'pointer', paddingBottom: '9px', borderBottom: '2px solid #6B3FD1', marginBottom: '-9px' }}>
            Sign in
          </div>
          <Link href="/auth/create-account" style={{ fontSize: '13.5px', fontWeight: '700', color: 'rgba(10,10,10,0.4)', textDecoration: 'none' }}>
            Create account
          </Link>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '6px',
            fontSize: '13.5px',
            fontWeight: '600',
            border: '1px solid rgba(10,10,10,0.12)',
            background: '#FFFFFF',
            borderRadius: '10px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            color: '#0A0A0A',
            opacity: isLoading ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <button
          type="button"
          onClick={handleAppleSignIn}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '14px',
            fontSize: '13.5px',
            fontWeight: '600',
            border: 'none',
            background: '#000000',
            borderRadius: '10px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            color: '#FFFFFF',
            opacity: isLoading ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <svg width="13" height="16" viewBox="0 0 15 18" fill="white">
            <path d="M11.2 9.49922C11.2 7.49922 12.8 6.49922 12.9 6.49922C12 5.19922 10.6 4.99922 10.1 4.99922C8.9 4.89922 7.8 5.69922 7.2 5.69922C6.6 5.69922 5.7 4.99922 4.7 4.99922C3.4 4.99922 2.2 5.69922 1.6 6.89922C0.300003 9.19922 1.3 12.6992 2.5 14.5992C3.1 15.4992 3.9 16.5992 4.9 16.4992C5.9 16.3992 6.2 15.8992 7.4 15.8992C8.6 15.8992 8.9 16.4992 9.9 16.4992C10.9 16.4992 11.6 15.5992 12.2 14.5992C12.9 13.4992 13.2 12.4992 13.2 12.3992C13.2 12.3992 11.2 11.5992 11.2 9.49922ZM9.4 3.49922C9.9 2.89922 10.2 1.99922 10.1 1.19922C9.4 1.19922 8.5 1.69922 8 2.29922C7.5 2.79922 7.1 3.69922 7.2 4.49922C8 4.59922 8.8 4.09922 9.4 3.49922Z"/>
          </svg>
          Continue with Apple
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(10,10,10,0.1)' }}></div>
          <span style={{ fontSize: '11.5px', color: 'rgba(10,10,10,0.4)' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(10,10,10,0.1)' }}></div>
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              fontSize: '13px',
              border: '1px solid rgba(10,10,10,0.12)',
              borderRadius: '10px',
              boxSizing: 'border-box',
              color: '#0A0A0A',
            }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Password</span>
          <div style={{ position: 'relative', display: 'flex' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                flex: 1,
                width: '100%',
                padding: '8px 34px 8px 10px',
                fontSize: '13px',
                border: '1px solid rgba(10,10,10,0.12)',
                borderRadius: '10px',
                boxSizing: 'border-box',
                color: '#0A0A0A',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
              style={{
                position: 'absolute',
                right: '4px',
                top: 0,
                bottom: 0,
                background: 'none',
                border: 'none',
                padding: 0,
                width: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(10,10,10,0.45)',
                cursor: 'pointer',
              }}
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                  <line x1="3" y1="21" x2="21" y2="3" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              )}
            </button>
          </div>
        </label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '8px' }}>
          {[
            { ok: has8Chars, label: 'At least 8 characters' },
            { ok: hasUppercase, label: 'One uppercase letter' },
            { ok: hasNumber, label: 'One number' },
          ].map((rule, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: rule.ok ? '#0A9B71' : 'rgba(10,10,10,0.35)' }}>
              <span style={{ width: '13px', height: '13px', borderRadius: '999px', flexShrink: 0, border: `1.5px solid ${rule.ok ? '#0A9B71' : 'rgba(10,10,10,0.35)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px' }}>
                {rule.ok ? '✓' : ''}
              </span>
              {rule.label}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={staySignedIn}
              onChange={(e) => setStaySignedIn(e.target.checked)}
              style={{
                width: '14px',
                height: '14px',
                cursor: 'pointer',
                accentColor: '#6B3FD1',
              }}
            />
            <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.6)', fontWeight: '500' }}>Stay signed in</span>
          </label>
          <Link href="#" style={{ fontSize: '11px', color: '#6B3FD1', fontWeight: '600', textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>

        {/* Cloudflare Turnstile CAPTCHA */}
        <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
          <div
            className="cf-turnstile"
            data-sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
            data-theme="light"
            data-callback="turnstileCallback"
            style={{ marginBottom: '0' }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ padding: '8px 10px', background: '#FFE5E5', border: '1px solid #E85D75', borderRadius: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '11px', color: '#E85D75', fontWeight: '500' }}>⚠️ {error}</span>
          </div>
        )}

        <button
          onClick={handleSignIn}
          disabled={isLoading || !email || !password}
          style={{
            width: '100%',
            padding: '11px',
            marginBottom: '10px',
            fontSize: '13px',
            fontWeight: '700',
            border: 'none',
            background: '#3EE8A8',
            borderRadius: '12px',
            cursor: isLoading || !email || !password ? 'not-allowed' : 'pointer',
            color: '#0A0A0A',
            opacity: isLoading || !email || !password ? 0.5 : 1,
          }}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>

        <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.45)', lineHeight: '1.5', textAlign: 'center' }}>
          By signing in you agree to Vibe Travel's <a href="/legal/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#6B3FD1', textDecoration: 'none' }}>Terms of Service</a> and <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#6B3FD1', textDecoration: 'none' }}>Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
