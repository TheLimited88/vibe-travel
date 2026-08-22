/* eslint-disable @typescript-eslint/no-namespace */
'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { geolocationOptions, isIosSafari } from '@/lib/pwaDisplayMode';
import AddToHomeScreenGuide from '@/components/AddToHomeScreenGuide';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PermissionItem {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  denyLabel: string;
  allowLabel: string;
}

interface BeforeExploreModalProps {
  // Fired once this modal has finished deciding what to do — either it has
  // nothing to show (signed-in user, or already seen), or the user just
  // finished it. Lets callers sequence something else (e.g. the legal
  // update banner) to only appear after this is out of the way.
  onResolved?: () => void;
}

export default function BeforeExploreModal({ onResolved }: BeforeExploreModalProps) {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [choices, setChoices] = useState<Record<string, 'allow' | 'deny'>>({});
  const [installGuideOpen, setInstallGuideOpen] = useState(false);
  const [installGuideDevice, setInstallGuideDevice] = useState<'ios' | 'android'>('ios');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [toast, setToast] = useState('');

  const permissions: PermissionItem[] = [
    {
      id: 'location',
      title: 'Share your location',
      description: 'Powers distance sort, the map, and geofence visit detection.',
      denyLabel: 'Not now',
      allowLabel: 'Allow',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7F53F3" strokeWidth="1.8">
          <path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" />
          <circle cx="12" cy="9.5" r="2.3" />
        </svg>
      ),
    },
    {
      id: 'notifications',
      title: 'Turn on notifications',
      description: "We'll ping you the moment you arrive somewhere interesting.",
      denyLabel: 'Not now',
      allowLabel: 'Allow',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path d="M12 22a2.5 2.5 0 002.4-2h-4.8a2.5 2.5 0 002.4 2z" fill="#7F53F3" />
          <path d="M18 16v-5a6 6 0 00-4-5.7V4a2 2 0 10-4 0v1.3A6 6 0 006 11v5l-2 2v1h16v-1l-2-2z" stroke="#7F53F3" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 'install',
      title: 'Add Vibe Travel to your Home Screen',
      description: 'Your next great place is one tap away.',
      denyLabel: 'Maybe later',
      allowLabel: 'Add',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7F53F3" strokeWidth="1.8">
          <rect x="7" y="2" width="10" height="20" rx="2" />
          <path d="M11 18h2" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    if (/android/i.test(navigator.userAgent)) {
      setInstallGuideDevice('android');
    }

    // Captured independently of PWAInstallPrompt's own listener — the
    // browser dispatches this once and every listener registered for it
    // receives the same event, so both can hold their own reference.
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    // Wait for Firebase to actually resolve sign-in state before deciding —
    // otherwise a signed-in user would briefly look signed-out on load.
    if (loading) return;

    // Only show for non-authenticated users (new/guest visitors); a signed-in
    // user has already been through this.
    if (!user) {
      const hasSeenModal = localStorage.getItem('beforeExploreModalSeen');
      if (!hasSeenModal) {
        setIsOpen(true);
        return;
      }
    }

    onResolved?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  const handleDeny = (permissionId: string) => {
    setChoices(prev => ({ ...prev, [permissionId]: 'deny' }));
  };

  const handleAllow = async (permissionId: string) => {
    if (permissionId === 'location') {
      navigator.geolocation.getCurrentPosition(() => {}, () => {}, geolocationOptions());
    } else if (permissionId === 'notifications') {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    } else if (permissionId === 'install') {
      // Prefer the real native install when the browser has actually
      // offered one (Chrome/Edge/Android); otherwise fall back to the
      // manual Share -> Add to Home Screen walkthrough (the only path
      // that exists at all on iOS, since Safari never fires this event).
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          localStorage.setItem('pwa_installed', 'true');
        }
        setChoices(prev => ({ ...prev, install: 'allow' }));
      } else {
        setInstallGuideOpen(true);
      }
      return;
    }
    setChoices(prev => ({ ...prev, [permissionId]: 'allow' }));
  };

  const finishInstallGuide = () => {
    setInstallGuideOpen(false);
    setChoices(prev => ({ ...prev, install: 'allow' }));
    // Best-effort signal so the later standalone iOS nudge doesn't ask
    // again — there's no way to verify "Add to Home Screen" actually
    // happened, same limitation as the standalone nudge itself.
    if (isIosSafari()) {
      localStorage.setItem('ios_add_home_done', 'true');
    }
    setToast('Installing Vibe Travel…');
    setTimeout(() => setToast(''), 2500);
  };

  const allResolved = permissions.every(p => choices[p.id]);

  const handleContinue = () => {
    if (!allResolved) return;
    localStorage.setItem('beforeExploreModalSeen', 'true');
    setIsOpen(false);
    onResolved?.();
  };

  if (!isOpen) return null;

  return (
    <>
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(10, 10, 10, 0.45)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '375px',
          background: '#FFFFFF',
          borderRadius: '24px 24px 0 0',
          padding: '22px 20px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ fontSize: '16px', fontWeight: 800, color: '#0A0A0A' }}>Before you explore</div>

        {permissions.map((permission, index) => (
          <div
            key={permission.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'flex-start',
              paddingBottom: index < permissions.length - 1 ? '14px' : 0,
              borderBottom: index < permissions.length - 1 ? '1px solid rgba(10,10,10,0.07)' : 'none',
            }}
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(127,83,243,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {permission.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0A0A0A' }}>{permission.title}</div>
                <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.6)', lineHeight: '1.4' }}>{permission.description}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', paddingLeft: '48px' }}>
              <button
                onClick={() => handleDeny(permission.id)}
                style={{
                  background: choices[permission.id] === 'deny' ? '#3EE8A8' : 'rgba(10,10,10,0.06)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#0A0A0A',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {permission.denyLabel}
              </button>
              <button
                onClick={() => handleAllow(permission.id)}
                style={{
                  background: choices[permission.id] === 'allow' ? '#3EE8A8' : '#7F53F3',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: choices[permission.id] === 'allow' ? '#0A0A0A' : '#fff',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {permission.allowLabel}
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={handleContinue}
          disabled={!allResolved}
          style={{
            width: '100%',
            padding: '13px',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            background: '#3EE8A8',
            borderRadius: '14px',
            cursor: allResolved ? 'pointer' : 'not-allowed',
            color: '#0A0A0A',
            opacity: allResolved ? 1 : 0.4,
          }}
        >
          Continue
        </button>
      </div>
    </div>

    {installGuideOpen && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10,10,10,0.45)',
          zIndex: 1010,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <AddToHomeScreenGuide
          device={installGuideDevice}
          onDeviceChange={setInstallGuideDevice}
          onDone={finishInstallGuide}
          onClose={() => setInstallGuideOpen(false)}
        />
      </div>
    )}

    {toast && (
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0A0A0A',
          color: '#fff',
          padding: '10px 18px',
          borderRadius: '999px',
          fontSize: '13px',
          fontWeight: 600,
          zIndex: 1020,
        }}
      >
        {toast}
      </div>
    )}
    </>
  );
}
