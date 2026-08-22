'use client';

import { useState, useEffect } from 'react';
import { recordVisit, setDismissedNow, isReadyToReshow } from '@/lib/installPromptDismissal';

const DISMISS_KEY = 'pwa_install_dismissed';
const BLOCK_KEY = 'pwa_install_blocked';
const INSTALLED_KEY = 'pwa_installed';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallPromptProps {
  // Only actually show once the caller says it's a good moment — e.g. after
  // onboarding permissions and any legal-update banner are out of the way,
  // plus a bit of settled time on the platform, so this doesn't stack right
  // on top of the other two.
  eligible: boolean;
}

export default function PWAInstallPrompt({ eligible }: PWAInstallPromptProps) {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [readyToShow, setReadyToShow] = useState(false);
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    const visits = recordVisit();
    setVisitCount(visits);

    const blocked = localStorage.getItem(BLOCK_KEY);
    const installed = localStorage.getItem(INSTALLED_KEY);
    if (blocked || installed || !isReadyToReshow(DISMISS_KEY, visits)) return;
    setReadyToShow(true);

    // The browser decides on its own timing whether/when this fires at all —
    // notably, Safari (iOS and desktop) never fires it; there, the only
    // install path is the manual "Add to Home Screen" walkthrough covered
    // by IosHomeScreenPrompt / BeforeExploreModal's onboarding step.
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (eligible && deferredPrompt && readyToShow) {
      setShow(true);
    }
  }, [eligible, deferredPrompt, readyToShow]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      localStorage.setItem(INSTALLED_KEY, 'true');
    }

    setShow(false);
  };

  const handleMaybeLater = () => {
    setDismissedNow(DISMISS_KEY, visitCount);
    setShow(false);
  };

  const handleDontShowAgain = () => {
    localStorage.setItem(BLOCK_KEY, 'true');
    setShow(false);
  };

  if (!show || !deferredPrompt) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}>
      <div style={{ width: '100%', maxWidth: '375px', margin: '0 auto', background: '#fff', borderRadius: '24px 24px 0 0', padding: '24px 16px 28px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <div style={{ fontSize: '18px', fontWeight: '700', color: '#0A0A0A', marginBottom: '12px', textAlign: 'center' }}>Add Vibe Travel to your Home Screen</div>

        <div style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)', lineHeight: '1.6', marginBottom: '24px', textAlign: 'center' }}>
          Your next great Place is one tap away.
        </div>

        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <button
            onClick={handleMaybeLater}
            style={{ flex: 1, background: '#fff', border: '1.5px solid rgba(10,10,10,0.15)', borderRadius: '999px', padding: '14px 16px', fontSize: '14px', fontWeight: '700', color: '#0A0A0A', cursor: 'pointer' }}
          >
            Maybe later
          </button>
          <button
            onClick={handleInstall}
            style={{ flex: 1, background: '#3EE8A8', border: 'none', borderRadius: '999px', padding: '14px 16px', fontSize: '14px', fontWeight: '700', color: '#0A0A0A', cursor: 'pointer' }}
          >
            Install
          </button>
        </div>

        <button
          onClick={handleDontShowAgain}
          style={{ background: 'none', border: 'none', marginTop: '16px', fontSize: '13px', color: 'rgba(10,10,10,0.5)', cursor: 'pointer' }}
        >
          Don&apos;t show again
        </button>
      </div>
    </div>
  );
}
