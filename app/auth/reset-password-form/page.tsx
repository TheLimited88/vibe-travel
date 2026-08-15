'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const LINK_VALIDITY_MINUTES = 10;
const LINK_VALIDITY_MS = LINK_VALIDITY_MINUTES * 60 * 1000;

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const timestamp = searchParams.get('timestamp') ? parseInt(searchParams.get('timestamp')!) : null;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLinkExpired, setIsLinkExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const has8Chars = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const isPasswordValid = has8Chars && hasUppercase && hasNumber;
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  useEffect(() => {
    if (!timestamp) {
      setIsLinkExpired(true);
      setIsLoading(false);
      return;
    }

    const currentTime = Date.now();
    const elapsedTime = currentTime - timestamp;

    if (elapsedTime > LINK_VALIDITY_MS) {
      setIsLinkExpired(true);
    }

    setIsLoading(false);
  }, [timestamp]);

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid || !passwordsMatch) {
      return;
    }

    console.log('Password reset for:', email);
    setShowSuccess(true);

    setTimeout(() => {
      router.push('/auth/signin');
    }, 2000);
  };

  const handleBackToSignIn = () => {
    router.push('/auth/signin');
  };

  const handleResendEmail = () => {
    router.push('/auth/reset-password');
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#FFFFFF', paddingTop: '20px' }}>
        <div style={{ width: '100%', maxWidth: '335px', paddingLeft: '20px', paddingRight: '20px' }}>
          <div style={{ textAlign: 'center', paddingTop: '40px' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (isLinkExpired) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#FFFFFF', paddingTop: '20px' }}>
        <div style={{ width: '100%', maxWidth: '335px', paddingLeft: '20px', paddingRight: '20px' }}>
          {/* Back Button */}
          <button
            onClick={handleBackToSignIn}
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

          {/* Error Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center', textAlign: 'center', paddingTop: '8px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '999px',
              background: 'rgba(209,69,69,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              color: '#D14545',
            }}>
              ✕
            </div>

            <div style={{ fontSize: '20px', fontWeight: '800', color: '#0A0A0A' }}>
              Link expired
            </div>

            <div style={{ fontSize: '13px', color: 'rgba(10,10,10,0.55)', lineHeight: '1.5' }}>
              Your password reset link expired. Password reset links are valid for {LINK_VALIDITY_MINUTES} minutes.
            </div>

            <button
              onClick={handleResendEmail}
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
              Request new link
            </button>

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

  if (showSuccess) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#FFFFFF', paddingTop: '20px' }}>
        <div style={{ width: '100%', maxWidth: '335px', paddingLeft: '20px', paddingRight: '20px' }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center', textAlign: 'center', paddingTop: '40px' }}>
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

            <div style={{ fontSize: '20px', fontWeight: '800', color: '#0A0A0A' }}>
              Password updated
            </div>

            <div style={{ fontSize: '13px', color: 'rgba(10,10,10,0.55)', lineHeight: '1.5' }}>
              Your password has been reset. Sign in with your new password.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#FFFFFF', paddingTop: '20px' }}>
      <div style={{ width: '100%', maxWidth: '335px', paddingLeft: '20px', paddingRight: '20px' }}>
        {/* Back Button */}
        <button
          onClick={handleBackToSignIn}
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
            Create a new password
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(10,10,10,0.55)', textAlign: 'center', lineHeight: '1.5' }}>
            Choose a new password for {email}.
          </div>
        </div>

        {/* New Password Input */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.55)' }}>New password</span>
          <input
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 13px',
              fontSize: '14px',
              border: '1px solid rgba(10,10,10,0.12)',
              borderRadius: '10px',
              boxSizing: 'border-box',
              color: '#0A0A0A',
            }}
          />
        </label>

        {/* Confirm Password Input */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.55)' }}>Confirm new password</span>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 13px',
              fontSize: '14px',
              border: `1px solid ${!passwordsMatch && confirmPassword ? '#D14545' : 'rgba(10,10,10,0.12)'}`,
              borderRadius: '10px',
              boxSizing: 'border-box',
              color: '#0A0A0A',
            }}
          />
        </label>

        {/* Password Requirements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '2px 2px 0', marginBottom: '12px' }}>
          {[
            { ok: has8Chars, label: 'At least 8 characters' },
            { ok: hasUppercase, label: 'One uppercase letter' },
            { ok: hasNumber, label: 'One number' },
          ].map((rule, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: rule.ok ? '#0A9B71' : 'rgba(10,10,10,0.35)' }}>
              <span style={{ width: '15px', height: '15px', borderRadius: '999px', flexShrink: 0, border: `1.5px solid ${rule.ok ? '#0A9B71' : 'rgba(10,10,10,0.35)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px' }}>
                {rule.ok ? '✓' : ''}
              </span>
              {rule.label}
            </div>
          ))}
        </div>

        {/* Mismatch Error */}
        {!passwordsMatch && confirmPassword && (
          <div style={{ fontSize: '12px', color: '#D14545', marginBottom: '12px' }}>
            Passwords don't match.
          </div>
        )}

        {/* Reset Button */}
        <button
          onClick={handleResetPassword}
          disabled={!isPasswordValid || !passwordsMatch}
          style={{
            width: '100%',
            padding: '13px',
            fontSize: '14px',
            fontWeight: '700',
            border: 'none',
            background: '#3EE8A8',
            borderRadius: '14px',
            cursor: isPasswordValid && passwordsMatch ? 'pointer' : 'not-allowed',
            color: '#0A0A0A',
            opacity: isPasswordValid && passwordsMatch ? 1 : 0.5,
          }}
        >
          Reset password
        </button>
      </div>
    </div>
  );
}

export default function ResetPasswordFormPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordFormContent />
    </Suspense>
  );
}
