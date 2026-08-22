'use client';

import { useState, useEffect } from 'react';

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
  const [dismissedOrInstalled, setDismissedOrInstalled] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa_install_dismissed');
    const installed = localStorage.getItem('pwa_installed');
    if (dismissed || installed) {
      setDismissedOrInstalled(true);
      return;
    }

    // The browser decides on its own timing whether/when this fires at all —
    // notably, Safari (iOS and desktop) never fires it; there, the only
    // install path is the manual "Add to Home Screen" walkthrough already
    // covered by BeforeExploreModal's onboarding step.
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
    if (eligible && deferredPrompt && !dismissedOrInstalled) {
      setShow(true);
    }
  }, [eligible, deferredPrompt, dismissedOrInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      localStorage.setItem('pwa_installed', 'true');
    }

    setShow(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa_install_dismissed', JSON.stringify({
      dismissed: true,
      timestamp: new Date().toISOString(),
    }));
    setShow(false);
  };

  if (!show || !deferredPrompt) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}>
      <div style={{ width: '100%', maxWidth: '375px', margin: '0 auto', background: '#fff', borderRadius: '24px 24px 0 0', padding: '24px 16px 32px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>

        <div style={{ fontSize: '18px', fontWeight: '700', color: '#0A0A0A', marginBottom: '12px' }}>Install Vibe Travel</div>

        <div style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)', lineHeight: '1.6', marginBottom: '24px' }}>
          Get quick access to your favorite places. Install the app on your home screen for easy browsing anytime.
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleDismiss}
            style={{ flex: 1, background: '#f0f0f0', border: 'none', borderRadius: '12px', padding: '14px 16px', fontSize: '14px', fontWeight: '700', color: '#0A0A0A', cursor: 'pointer' }}
          >
            Not Now
          </button>
          <button
            onClick={handleInstall}
            style={{ flex: 1, background: '#3EE8A8', border: 'none', borderRadius: '12px', padding: '14px 16px', fontSize: '14px', fontWeight: '700', color: '#0A0A0A', cursor: 'pointer' }}
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
