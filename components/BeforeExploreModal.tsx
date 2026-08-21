/* eslint-disable @typescript-eslint/no-namespace */
'use client';

import { useState, useEffect, ReactNode, CSSProperties } from 'react';

interface PermissionItem {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
}

export default function BeforeExploreModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [choices, setChoices] = useState<Record<string, 'allow' | 'deny'>>({});
  const [installGuideOpen, setInstallGuideOpen] = useState(false);
  const [installGuideDevice, setInstallGuideDevice] = useState<'ios' | 'android'>('ios');
  const [toast, setToast] = useState('');

  const permissions: PermissionItem[] = [
    {
      id: 'location',
      title: 'Share your location',
      description: 'Powers distance sort, the map, and geofence visit detection.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7F53F3" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      ),
    },
    {
      id: 'notifications',
      title: 'Turn on notifications',
      description: "We'll ping you the moment you arrive somewhere interesting.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7F53F3" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      ),
    },
    {
      id: 'install',
      title: 'Install Vibe Travel',
      description: 'Works like an app — add it to your home screen for one-tap access.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7F53F3" strokeWidth="2">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12" y2="18.01"></line>
        </svg>
      ),
    },
  ];

  useEffect(() => {
    // Check if user is logged in
    const userToken = localStorage.getItem('user_token');
    const userSession = localStorage.getItem('user_session');
    const isLoggedIn = !!userToken || !!userSession;

    // Only show for non-authenticated users (new users)
    if (!isLoggedIn) {
      const hasSeenModal = localStorage.getItem('beforeExploreModalSeen');
      if (!hasSeenModal) {
        setIsOpen(true);
      }
    }

    if (/android/i.test(navigator.userAgent)) {
      setInstallGuideDevice('android');
    }
  }, []);

  const handleDeny = (permissionId: string) => {
    setChoices(prev => ({ ...prev, [permissionId]: 'deny' }));
  };

  const handleAllow = (permissionId: string) => {
    if (permissionId === 'location') {
      navigator.geolocation.getCurrentPosition(() => {}, () => {});
    } else if (permissionId === 'notifications') {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    } else if (permissionId === 'install') {
      setInstallGuideOpen(true);
      return;
    }
    setChoices(prev => ({ ...prev, [permissionId]: 'allow' }));
  };

  const finishInstallGuide = () => {
    setInstallGuideOpen(false);
    setChoices(prev => ({ ...prev, install: 'allow' }));
    setToast('Installing Vibe Travel…');
    setTimeout(() => setToast(''), 2500);
  };

  const allResolved = permissions.every(p => choices[p.id]);

  const handleContinue = () => {
    if (!allResolved) return;
    localStorage.setItem('beforeExploreModalSeen', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const tabStyle = (active: boolean): CSSProperties => ({
    flex: 1,
    padding: '10px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '12.5px',
    fontWeight: 700,
    cursor: 'pointer',
    background: active ? '#0A0A0A' : 'rgba(10,10,10,0.06)',
    color: active ? '#fff' : '#0A0A0A',
  });

  const stepRow = (n: number, content: ReactNode) => (
    <div key={n} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '999px',
          background: 'rgba(127,83,243,0.12)',
          color: '#6B3FD1',
          fontWeight: 800,
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {n}
      </div>
      <div style={{ fontSize: '14px', color: '#0A0A0A', lineHeight: '1.5' }}>{content}</div>
    </div>
  );

  return (
    <>
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
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
          borderRadius: '20px 20px 0 0',
          padding: '28px 20px 20px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Title */}
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 600,
            margin: '0 0 20px 0',
            textAlign: 'center',
            color: '#0A0A0A',
          }}
        >
          Before you explore
        </h2>

        {/* Permission Items */}
        <div style={{ marginBottom: '20px' }}>
          {permissions.map((permission, index) => (
            <div
              key={permission.id}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                marginBottom: index < permissions.length - 1 ? '16px' : 0,
                paddingBottom: index < permissions.length - 1 ? '16px' : 0,
                borderBottom: index < permissions.length - 1 ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#EEF0EA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {permission.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0A0A0A',
                    margin: '0 0 2px 0',
                  }}
                >
                  {permission.title}
                </h3>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'rgba(10, 10, 10, 0.55)',
                    lineHeight: '1.4',
                    margin: 0,
                  }}
                >
                  {permission.description}
                </p>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button
                  onClick={() => handleDeny(permission.id)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: choices[permission.id] === 'deny' ? 'none' : '1px solid rgba(10, 10, 10, 0.1)',
                    background: choices[permission.id] === 'deny' ? '#3EE8A8' : '#FFFFFF',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: '#0A0A0A',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Deny
                </button>
                <button
                  onClick={() => handleAllow(permission.id)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: 'none',
                    background: choices[permission.id] === 'allow' ? '#3EE8A8' : '#7F53F3',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: choices[permission.id] === 'allow' ? '#0A0A0A' : '#FFFFFF',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {permission.id === 'install' ? 'Install' : 'Allow'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!allResolved}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '15px',
            fontWeight: 600,
            border: 'none',
            background: '#25EFB8',
            borderRadius: '10px',
            cursor: allResolved ? 'pointer' : 'not-allowed',
            color: '#0A0A0A',
            opacity: allResolved ? 1 : 0.4,
          }}
        >
          Continue
        </button>
        {!allResolved && (
          <p
            style={{
              textAlign: 'center',
              fontSize: '12px',
              color: 'rgba(10, 10, 10, 0.45)',
              margin: '10px 0 0',
            }}
          >
            Choose Allow or Deny for each option to continue.
          </p>
        )}
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
        <div
          style={{
            background: '#fff',
            borderRadius: '24px 24px 0 0',
            width: '100%',
            maxWidth: '375px',
            padding: '22px 20px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxHeight: '82vh',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0A0A0A' }}>Install Vibe Travel</div>
            <button
              onClick={() => setInstallGuideOpen(false)}
              aria-label="Close"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '999px',
                background: 'rgba(10,10,10,0.06)',
                border: 'none',
                color: 'rgba(10,10,10,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => setInstallGuideDevice('ios')} style={tabStyle(installGuideDevice === 'ios')}>
              iPhone (Safari)
            </button>
            <button onClick={() => setInstallGuideDevice('android')} style={tabStyle(installGuideDevice === 'android')}>
              Android (Chrome)
            </button>
          </div>

          {installGuideDevice === 'ios' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {stepRow(
                1,
                <>
                  Tap the menu{' '}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: '-2px' }}>
                    <path d="M12 3v13M7 8l5-5 5 5" stroke="#7F53F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="4" y="17" width="16" height="4" rx="1" stroke="#7F53F3" strokeWidth="2" />
                  </svg>{' '}
                  Share icon in the bottom toolbar.
                </>
              )}
              {stepRow(
                2,
                <>
                  Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.
                </>
              )}
              {stepRow(
                3,
                <>
                  Tap <strong style={{ color: '#6B3FD1' }}>Add</strong> in the top right corner.
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {stepRow(
                1,
                <>
                  Tap the{' '}
                  <svg width="4" height="14" viewBox="0 0 4 14" fill="none" style={{ verticalAlign: '-2px' }}>
                    <circle cx="2" cy="2" r="2" fill="#7F53F3" />
                    <circle cx="2" cy="7" r="2" fill="#7F53F3" />
                    <circle cx="2" cy="12" r="2" fill="#7F53F3" />
                  </svg>{' '}
                  3-dot menu at the top right.
                </>
              )}
              {stepRow(
                2,
                <>
                  Select <strong>&quot;Add to Home Screen&quot;</strong> or <strong>&quot;Install App&quot;</strong>.
                </>
              )}
              {stepRow(
                3,
                <>
                  Confirm by tapping <strong style={{ color: '#6B3FD1' }}>Install</strong> or <strong style={{ color: '#6B3FD1' }}>Add</strong>.
                </>
              )}
            </div>
          )}

          <button
            onClick={finishInstallGuide}
            style={{
              background: '#3EE8A8',
              color: '#0A0A0A',
              border: 'none',
              borderRadius: '14px',
              padding: '13px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Got it
          </button>
        </div>
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
