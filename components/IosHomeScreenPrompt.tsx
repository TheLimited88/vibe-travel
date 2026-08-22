'use client';

import { useEffect, useState } from 'react';
import { isInstalledPwa } from '@/lib/pwaDisplayMode';
import AddToHomeScreenGuide from '@/components/AddToHomeScreenGuide';

interface IosHomeScreenPromptProps {
  // Only actually show once the caller says it's a good moment — same
  // sequencing as the Android install prompt: permissions, then any legal
  // update, then a settled period on the platform.
  eligible: boolean;
}

function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return true;
  // iPadOS 13+ reports itself as "Macintosh" in Safari by default — the
  // classic touch-points + platform check is the standard way to still
  // catch it.
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

// Safari never fires beforeinstallprompt (see PWAInstallPrompt), so on iOS
// the only way onto the home screen is the manual Share -> Add to Home
// Screen flow. This surfaces that nudge on its own, later in the session,
// for visitors who didn't already add it during onboarding.
export default function IosHomeScreenPrompt({ eligible }: IosHomeScreenPromptProps) {
  const [applicable, setApplicable] = useState(false);
  const [show, setShow] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('ios_add_home_dismissed');
    const done = localStorage.getItem('ios_add_home_done');
    if (dismissed || done || isInstalledPwa() || !isIosSafari()) return;
    setApplicable(true);
  }, []);

  useEffect(() => {
    if (eligible && applicable) setShow(true);
  }, [eligible, applicable]);

  const handleDismiss = () => {
    localStorage.setItem('ios_add_home_dismissed', JSON.stringify({ dismissed: true, timestamp: new Date().toISOString() }));
    setShow(false);
  };

  const handleShowMe = () => setGuideOpen(true);

  const handleGuideDone = () => {
    localStorage.setItem('ios_add_home_done', 'true');
    setGuideOpen(false);
    setShow(false);
  };

  if (!show) return null;

  return (
    <>
      {!guideOpen && (
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
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#0A0A0A' }}>Add Vibe Travel to your Home Screen</div>
          <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.65)', lineHeight: '1.5' }}>
            Get one-tap access and instant alerts when you arrive somewhere new. Takes about 10 seconds to set up.
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleDismiss}
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
              Not now
            </button>
            <button
              onClick={handleShowMe}
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
              Show me how
            </button>
          </div>
        </div>
      )}

      {guideOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10,10,10,0.45)',
            zIndex: 1010,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <AddToHomeScreenGuide
            device="ios"
            onDeviceChange={() => {}}
            onDone={handleGuideDone}
            onClose={() => setGuideOpen(false)}
            showDeviceTabs={false}
          />
        </div>
      )}
    </>
  );
}
