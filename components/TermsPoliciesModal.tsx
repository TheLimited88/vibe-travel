'use client';

import { useState, useEffect } from 'react';

interface TermsPoliciesModalProps {
  onContinue?: () => void;
}

export default function TermsPoliciesModal({ onContinue }: TermsPoliciesModalProps) {
  const [show, setShow] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in (has an account)
    const userToken = localStorage.getItem('user_token');
    const userSession = localStorage.getItem('user_session');
    const isAuthenticated = !!userToken || !!userSession;

    setIsLoggedIn(isAuthenticated);

    // Only show for logged-in users
    if (isAuthenticated) {
      const accepted = localStorage.getItem('tospp_accepted');
      if (!accepted) {
        // Show after 5 seconds
        const timer = setTimeout(() => {
          setShow(true);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleContinue = () => {
    localStorage.setItem('tospp_accepted', JSON.stringify({
      accepted: true,
      timestamp: new Date().toISOString(),
    }));
    setShow(false);
    onContinue?.();
  };

  const handleReview = () => {
    window.location.href = '/content/terms';
  };

  if (!show) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end', zIndex: 2000 }}>
      <div style={{ width: '100%', maxWidth: '375px', margin: '0 auto', background: '#fff', borderRadius: '24px 24px 0 0', padding: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>

        <div style={{ fontSize: '16px', fontWeight: '700', color: '#0A0A0A', marginBottom: '8px', textAlign: 'center' }}>We've Updated Our Terms & Policies</div>

        <div style={{ fontSize: '13px', color: 'rgba(10,10,10,0.6)', lineHeight: '1.5', marginBottom: '16px', textAlign: 'center' }}>
          We've made updates to our Terms of Service and/or Privacy Policy. Please review the latest changes. By continuing to use Vibe Travel, you agree to the updates where permitted by applicable law.
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleReview}
            style={{ flex: 1, background: '#f0f0f0', border: 'none', borderRadius: '10px', padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#0A0A0A', cursor: 'pointer' }}
          >
            Review Updates
          </button>
          <button
            onClick={handleContinue}
            style={{ flex: 1, background: '#3EE8A8', border: 'none', borderRadius: '10px', padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#0A0A0A', cursor: 'pointer' }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
