'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSignInPage() {
  const router = useRouter();
  const [authTab, setAuthTab] = useState<'signin' | 'create'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminToken', 'authenticated');
        router.push('/admin/verify-2fa');
      } else {
        setError(data.error || 'Authentication failed. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
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

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(220, 53, 69, 0.1)',
            border: '1px solid rgb(220, 53, 69)',
            borderRadius: '12px',
            padding: '12px',
            fontSize: '13px',
            color: 'rgb(220, 53, 69)',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

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
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid rgba(10,10,10,0.12)',
                    borderRadius: '12px',
                    padding: '12px 40px 12px 14px',
                    fontSize: '14px',
                    fontFamily: "'Inter',sans-serif",
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: 'rgba(10,10,10,0.4)',
                    padding: '0',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showPassword ? '◉' : '○'}
                </button>
              </div>
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
