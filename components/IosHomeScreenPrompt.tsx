'use client';

import { useEffect, useState } from 'react';
import { isInstalledPwa } from '@/lib/pwaDisplayMode';
import { recordVisit, setDismissedNow, isReadyToReshow } from '@/lib/installPromptDismissal';
import AddToHomeScreenGuide from '@/components/AddToHomeScreenGuide';

const DISMISS_KEY = 'ios_add_home_dismissed';
const BLOCK_KEY = 'ios_add_home_blocked';
const DONE_KEY = 'ios_add_home_done';

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
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    const visits = recordVisit();
    setVisitCount(visits);

    const blocked = localStorage.getItem(BLOCK_KEY);
    const done = localStorage.getItem(DONE_KEY);
    if (blocked || done || isInstalledPwa() || !isIosSafari() || !isReadyToReshow(DISMISS_KEY, visits)) return;
    setApplicable(true);
  }, []);

  useEffect(() => {
    if (eligible && applicable) setShow(true);
  }, [eligible, applicable]);

  const handleMaybeLater = () => {
    setDismissedNow(DISMISS_KEY, visitCount);
    setShow(false);
  };

  const handleDontShowAgain = () => {
    localStorage.setItem(BLOCK_KEY, 'true');
    setShow(false);
  };

  const handleShowMe = () => setGuideOpen(true);

  const handleGuideDone = () => {
    localStorage.setItem(DONE_KEY, 'true');
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
            Your next great Place is one tap away.
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleMaybeLater}
              style={{
                flex: 1,
                background: '#fff',
                color: '#0A0A0A',
                border: '1.5px solid rgba(10,10,10,0.15)',
                borderRadius: '999px',
                padding: '10px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Maybe later
            </button>
            <button
              onClick={handleShowMe}
              style={{
                flex: 1,
                background: '#3EE8A8',
                color: '#0A0A0A',
                border: 'none',
                borderRadius: '999px',
                padding: '10px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Show me how
            </button>
          </div>
          <button
            onClick={handleDontShowAgain}
            style={{ background: 'none', border: 'none', fontSize: '12px', color: 'rgba(10,10,10,0.5)', cursor: 'pointer' }}
          >
            Don&apos;t show again
          </button>
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
