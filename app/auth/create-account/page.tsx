'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateAccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const has8Chars = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = has8Chars && hasUppercase && hasNumber;

  const handleCreateAccount = () => {
    console.log('handleCreateAccount called', { isPasswordValid, captchaChecked, email });
    if (isPasswordValid && captchaChecked && email) {
      console.log('Conditions met, setting showVerification to true');
      setShowVerification(true);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length === 6) {
      console.log('Verify email:', { email, verificationCode });
      setShowVerification(false);
      router.push('/');
    }
  };

  const handleResend = () => {
    console.log('Resend code to:', email);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#FFFFFF', paddingTop: '20px' }}>
      <div style={{ width: '100%', maxWidth: '335px' }}>
        <button
          onClick={() => router.push('/')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
          }}
        >
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="44" height="44" rx="22" fill="white"/>
            <rect x="0.5" y="0.5" width="43" height="43" rx="21.5" stroke="#0A0A0A" strokeOpacity="0.08"/>
            <path d="M23.4901 25.4609H22.5077L20.5996 22.6271V22.5327H21.6764L23.4901 25.4609ZM23.4901 19.6611L21.6764 22.5893H20.5996V22.4949L22.5077 19.6611H23.4901Z" fill="black"/>
          </svg>
        </button>

        <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 28px', textAlign: 'center', color: '#0A0A0A' }}>
          Welcome to Vibe Travel
        </h1>

        <div style={{ display: 'flex', gap: '40px', marginBottom: '28px', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '12px' }}>
          <Link href="/auth/signin" style={{ fontSize: '16px', fontWeight: '400', color: 'rgba(0,0,0,0.4)', textDecoration: 'none' }}>
            Sign in
          </Link>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#0A0A0A', paddingBottom: '12px', borderBottom: '3px solid #7F53F3', marginBottom: '-12px' }}>
            Create account
          </div>
        </div>

        <button
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '12px',
            fontSize: '16px',
            fontWeight: '600',
            border: '1px solid rgba(0,0,0,0.1)',
            background: '#FFFFFF',
            borderRadius: '12px',
            cursor: 'pointer',
            color: '#0A0A0A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
            padding: '12px',
            marginBottom: '20px',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            background: '#000000',
            borderRadius: '12px',
            cursor: 'pointer',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <svg width="15" height="18" viewBox="0 0 15 18" fill="white">
            <path d="M11.2 9.49922C11.2 7.49922 12.8 6.49922 12.9 6.49922C12 5.19922 10.6 4.99922 10.1 4.99922C8.9 4.89922 7.8 5.69922 7.2 5.69922C6.6 5.69922 5.7 4.99922 4.7 4.99922C3.4 4.99922 2.2 5.69922 1.6 6.89922C0.300003 9.19922 1.3 12.6992 2.5 14.5992C3.1 15.4992 3.9 16.5992 4.9 16.4992C5.9 16.3992 6.2 15.8992 7.4 15.8992C8.6 15.8992 8.9 16.4992 9.9 16.4992C10.9 16.4992 11.6 15.5992 12.2 14.5992C12.9 13.4992 13.2 12.4992 13.2 12.3992C13.2 12.3992 11.2 11.5992 11.2 9.49922ZM9.4 3.49922C9.9 2.89922 10.2 1.99922 10.1 1.19922C9.4 1.19922 8.5 1.69922 8 2.29922C7.5 2.79922 7.1 3.69922 7.2 4.49922C8 4.59922 8.8 4.09922 9.4 3.49922Z"/>
          </svg>
          Continue with Apple
        </button>

        <div style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(0,0,0,0.4)', marginBottom: '20px' }}>or</div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0A0A0A', marginBottom: '8px' }}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              fontSize: '16px',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '10px',
              boxSizing: 'border-box',
              color: '#0A0A0A',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0A0A0A', marginBottom: '8px' }}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              fontSize: '16px',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '10px',
              boxSizing: 'border-box',
              color: '#0A0A0A',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          {[has8Chars, hasUppercase, hasNumber].map((checked, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: i < 2 ? '8px' : '0' }}>
              <input type="radio" checked={checked} readOnly style={{ width: '16px', height: '16px', cursor: 'default', accentColor: '#7F53F3' }} />
              <label style={{ fontSize: '14px', color: 'rgba(0,0,0,0.4)' }}>
                {i === 0 ? 'At least 8 characters' : i === 1 ? 'One uppercase letter' : 'One number'}
              </label>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px', padding: '12px 14px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '10px' }}>
          <input type="checkbox" checked={captchaChecked} onChange={(e) => setCaptchaChecked(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
          <label style={{ fontSize: '14px', color: '#0A0A0A', flex: 1 }}>Verify you are human</label>
          <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.4)' }}>Cloudflare</span>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isPasswordValid && captchaChecked && email) {
              console.log('Create account:', { email, password });
              setShowVerification(true);
            }
          }}
          disabled={!isPasswordValid || !captchaChecked || !email}
          style={{
            width: '100%',
            padding: '14px',
            marginBottom: '16px',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            background: '#25EFB8',
            borderRadius: '12px',
            cursor: 'pointer',
            color: '#0A0A0A',
            opacity: isPasswordValid && captchaChecked && email ? 1 : 0.5,
          }}
        >
          Create account
        </button>

        <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', textAlign: 'center', margin: '16px 0 0', lineHeight: '1.6' }}>
          By creating an account you agree to Vibe Travel's <Link href="#" style={{ color: '#7F53F3', textDecoration: 'none' }}>Terms of Service</Link> and <Link href="#" style={{ color: '#7F53F3', textDecoration: 'none' }}>Privacy Policy</Link>.
        </p>

        {showVerification && (
          <>
            <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }} />
            <div style={{ position: 'fixed', height: 'auto', maxHeight: '80vh', left: '0px', right: '0px', bottom: '0px', background: '#FFFFFF', borderRadius: '24px 24px 0px 0px', padding: '24px 20px 80px 20px', boxSizing: 'border-box', overflow: 'auto', zIndex: 1000 }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 8px', color: '#0A0A0A' }}>Verify your email</h2>
            <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)', margin: '0 0 20px', lineHeight: '1.5' }}>
              We sent a 6-digit code to your email. Enter it below to finish creating your account.
            </p>

            <input
              type="text"
              placeholder="1 2 3 4 5 6"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '10px',
                boxSizing: 'border-box',
                color: '#0A0A0A',
                textAlign: 'center',
                letterSpacing: '6px',
                marginBottom: '16px',
              }}
            />

            <button
              onClick={handleVerify}
              style={{
                position: 'absolute',
                width: '322px',
                height: '42px',
                left: '20px',
                top: '167px',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                background: '#3EE8A8',
                borderRadius: '14px',
                cursor: 'pointer',
                color: '#0A0A0A',
              }}
            >
              Verify & continue
            </button>

            <button
              type="button"
              onClick={handleResend}
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'none',
                border: 'none',
                color: '#7F53F3',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '8px 0',
                textDecoration: 'none',
              }}
            >
              Resend code
            </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
