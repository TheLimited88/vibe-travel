'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { sendVerificationEmail } from '@/lib/auth';

export default function CreateAccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);
  const [termsVersion, setTermsVersion] = useState<string | null>(null);
  const [privacyVersion, setPrivacyVersion] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');

  const has8Chars = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = has8Chars && hasUppercase && hasNumber;

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/content?key=terms').then((r) => r.json()).catch(() => null),
      fetch('/api/admin/content?key=privacy').then((r) => r.json()).catch(() => null),
    ]).then(([termsData, privacyData]) => {
      const terms = termsData?.versions?.length ? termsData.versions[termsData.versions.length - 1].version : null;
      const privacy = privacyData?.versions?.length ? privacyData.versions[privacyData.versions.length - 1].version : null;
      setTermsVersion(terms);
      setPrivacyVersion(privacy);
    });
  }, []);

  const handleCreateAccount = async () => {
    if (!isPasswordValid || !captchaChecked || !email || !agreedToPolicies) return;

    setIsLoading(true);
    setError('');

    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUserId = userCredential.user.uid;
      setUserId(newUserId);

      const policyAcceptances = [
        ...(termsVersion ? [{ page: 'terms', version: termsVersion, acceptedAt: Date.now() }] : []),
        ...(privacyVersion ? [{ page: 'privacy', version: privacyVersion, acceptedAt: Date.now() }] : []),
      ];

      // Create user document in Firestore
      await setDoc(doc(db, 'users', newUserId), {
        email,
        name: '',
        emailVerified: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        savedPlaces: [],
        visitedPlaces: [],
        reviews: [],
        status: 'active',
        signupMethod: 'Email',
        policyAcceptances,
      });

      // Send verification email
      const emailSent = await sendVerificationEmail(email, newUserId);

      if (emailSent) {
        setShowVerification(true);
      } else {
        setError('Failed to send verification email. Please try again.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // User will be redirected via email link to verify-email page
    // Show message about checking email
    router.push('/auth/reset-email-sent');
  };

  const handleResend = async () => {
    if (!userId) return;

    setIsLoading(true);
    const emailSent = await sendVerificationEmail(email, userId);

    if (emailSent) {
      setError('');
      alert('Verification email resent. Please check your inbox.');
    } else {
      setError('Failed to resend verification email');
    }
    setIsLoading(false);
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
          <Link href="/auth/signin" style={{ fontSize: '13.5px', fontWeight: '700', color: 'rgba(10,10,10,0.4)', textDecoration: 'none' }}>
            Sign in
          </Link>
          <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0A0A0A', cursor: 'pointer', paddingBottom: '9px', borderBottom: '2px solid #6B3FD1', marginBottom: '-9px' }}>
            Create account
          </div>
        </div>

        <button
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '6px',
            fontSize: '13.5px',
            fontWeight: '600',
            border: '1px solid rgba(10,10,10,0.12)',
            background: '#FFFFFF',
            borderRadius: '10px',
            cursor: 'pointer',
            color: '#0A0A0A',
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
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '14px',
            fontSize: '13.5px',
            fontWeight: '600',
            border: 'none',
            background: '#000000',
            borderRadius: '10px',
            cursor: 'pointer',
            color: '#FFFFFF',
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
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', border: '1px solid rgba(10,10,10,0.1)', borderRadius: '6px', padding: '8px 10px', background: '#fafafa', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', border: '1.5px solid rgba(10,10,10,0.3)', borderRadius: '3px', flexShrink: 0 }}></div>
            <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.65)' }}>Verify you are human</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#F6821F"><path d="M17 15.5c1.4 0 2.5-1.1 2.5-2.5 0-1.3-1-2.4-2.3-2.5-.3-2.5-2.4-4.5-5-4.5-2 0-3.7 1.2-4.5 2.9-1.9.2-3.4 1.8-3.4 3.8 0 2.1 1.7 3.8 3.8 3.8H17z"/></svg>
            <span style={{ fontSize: '7px', color: 'rgba(10,10,10,0.4)', letterSpacing: '0.2px' }}>Cloudflare</span>
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(197, 56, 85, 0.1)', borderRadius: '8px', marginBottom: '12px', fontSize: '12px', color: '#C53855' }}>
            {error}
          </div>
        )}

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '14px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={agreedToPolicies}
            onChange={(e) => setAgreedToPolicies(e.target.checked)}
            style={{ marginTop: '2px', width: '14px', height: '14px', flexShrink: 0, cursor: 'pointer' }}
          />
          <span style={{ fontSize: '10px', color: 'rgba(10,10,10,0.5)', lineHeight: '1.4' }}>
            I agree to Vibe Travel's{' '}
            <a href="/legal/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#6B3FD1', textDecoration: 'none' }}>Terms of Service</a>
            {' '}and{' '}
            <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#6B3FD1', textDecoration: 'none' }}>Privacy Policy</a>.
          </span>
        </label>

        <button
          type="button"
          onClick={handleCreateAccount}
          disabled={!isPasswordValid || !captchaChecked || !email || !agreedToPolicies || isLoading}
          style={{
            width: '100%',
            padding: '11px',
            marginBottom: '10px',
            fontSize: '13px',
            fontWeight: '700',
            border: 'none',
            background: '#3EE8A8',
            borderRadius: '12px',
            cursor: 'pointer',
            color: '#0A0A0A',
            opacity: isPasswordValid && captchaChecked && email && agreedToPolicies && !isLoading ? 1 : 0.5,
          }}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>

        {showVerification && (
          <>
            <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }} />
            <div style={{ position: 'fixed', height: 'auto', maxHeight: '80vh', left: '0px', right: '0px', bottom: '0px', background: '#FFFFFF', borderRadius: '24px 24px 0px 0px', padding: '24px 20px 80px 20px', boxSizing: 'border-box', overflow: 'auto', zIndex: 1000 }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 12px', color: '#0A0A0A' }}>Check your email</h2>
              <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.6)', margin: '0 0 20px', lineHeight: '1.6' }}>
                We sent a verification link to <strong>{email}</strong>. Click the link in the email to verify your account and complete sign up.
              </p>

              <div style={{ background: 'rgba(107, 63, 209, 0.1)', borderRadius: '8px', padding: '12px', marginBottom: '20px', fontSize: '12px', color: '#6B3FD1' }}>
                📧 The link expires in 60 minutes
              </div>

              <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)', margin: '0 0 16px' }}>
                Didn't receive an email?
              </p>

              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'none',
                  border: '1px solid #6B3FD1',
                  borderRadius: '8px',
                  color: '#6B3FD1',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '12px',
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                {isLoading ? 'Sending...' : 'Resend verification link'}
              </button>

              <button
                onClick={() => router.push('/')}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#6B3FD1',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Back to home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
