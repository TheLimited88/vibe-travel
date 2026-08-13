'use client';

import { useState, useEffect } from 'react';

export default function PWAInstallPrompt() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if already installed or dismissed
    const dismissed = localStorage.getItem('pwa_install_dismissed');
    const installed = localStorage.getItem('pwa_installed');

    if (dismissed || installed) {
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Check if ToS/PP was just accepted
    const tosppAccepted = localStorage.getItem('tospp_accepted');
    if (tosppAccepted) {
      const acceptedData = JSON.parse(tosppAccepted);
      const timeSinceAccepted = Date.now() - new Date(acceptedData.timestamp).getTime();

      // Show PWA prompt 30 seconds after ToS/PP acceptance
      if (timeSinceAccepted < 35000) {
        setTimeout(() => {
          setShow(true);
        }, 30000 - timeSinceAccepted);
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

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
