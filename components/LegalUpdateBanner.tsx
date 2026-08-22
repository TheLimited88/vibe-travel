'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

interface Outdated {
  terms: boolean;
  privacy: boolean;
}

interface LegalUpdateBannerProps {
  // Fired once this banner has finished deciding what to do — either it has
  // nothing to show (not signed in, or nothing outdated), or the user just
  // finished it. Lets callers sequence something else (e.g. the PWA install
  // prompt) to only appear once this is out of the way.
  onResolved?: () => void;
}

export default function LegalUpdateBanner({ onResolved }: LegalUpdateBannerProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [outdated, setOutdated] = useState<Outdated | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const resolvedRef = useRef(false);

  const resolve = () => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    onResolved?.();
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      resolve();
      return;
    }
    let cancelled = false;
    user.getIdToken().then((token) => {
      fetch('/api/account/policy-status', { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.outdated) setOutdated(data.outdated);
          if (!data.outdated?.terms && !data.outdated?.privacy) resolve();
        })
        .catch(() => resolve());
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  const showBanner = !!user && !dismissed && !!outdated && (outdated.terms || outdated.privacy);
  if (!showBanner || !outdated) return null;

  const acceptOutdated = async () => {
    const token = await user!.getIdToken();
    const pages = [outdated.terms && 'terms', outdated.privacy && 'privacy'].filter(Boolean);
    fetch('/api/account/accept-policies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ pages }),
    }).catch(() => {});
  };

  const handleContinue = () => {
    setDismissed(true);
    acceptOutdated();
    resolve();
  };

  const handleReview = () => {
    setDismissed(true);
    acceptOutdated();
    resolve();
    router.push(outdated.privacy && !outdated.terms ? '/legal/privacy' : '/legal/terms');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '88px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 24px)',
        maxWidth: '351px',
        background: '#fff',
        borderRadius: '16px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
        border: '1px solid rgba(10,10,10,0.08)',
        zIndex: 66,
      }}
    >
      <div style={{ fontSize: '14px', fontWeight: '800', color: '#0A0A0A' }}>We&apos;ve Updated Our Terms &amp; Policies</div>
      <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.65)', lineHeight: '1.5' }}>
        We&apos;ve made updates to our Terms of Service and/or Privacy Policy. Please review the latest changes. By
        continuing to use Vibe Travel, you agree to the updates where permitted by applicable law.
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handleReview}
          style={{
            flex: 1,
            background: 'rgba(10,10,10,0.06)',
            color: '#0A0A0A',
            border: 'none',
            borderRadius: '12px',
            padding: '10px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          Review Updates
        </button>
        <button
          onClick={handleContinue}
          style={{
            flex: 1,
            background: '#3EE8A8',
            color: '#0A0A0A',
            border: 'none',
            borderRadius: '12px',
            padding: '10px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
