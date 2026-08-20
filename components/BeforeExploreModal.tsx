/* eslint-disable @typescript-eslint/no-namespace */
'use client';

import { useState, useEffect, ReactNode } from 'react';

interface PermissionItem {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
}

export default function BeforeExploreModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [choices, setChoices] = useState<Record<string, 'allow' | 'deny'>>({});

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
    }
    setChoices(prev => ({ ...prev, [permissionId]: 'allow' }));
  };

  const allResolved = permissions.every(p => choices[p.id]);

  const handleContinue = () => {
    if (!allResolved) return;
    localStorage.setItem('beforeExploreModalSeen', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
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
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: '100%',
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
                    border: choices[permission.id] === 'deny' ? '1px solid #0A0A0A' : '1px solid rgba(10, 10, 10, 0.1)',
                    background: choices[permission.id] === 'deny' ? '#0A0A0A' : '#FFFFFF',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: choices[permission.id] === 'deny' ? '#FFFFFF' : '#0A0A0A',
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
                    background: choices[permission.id] === 'allow' ? '#5E33D6' : '#7F53F3',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: '#FFFFFF',
                    whiteSpace: 'nowrap',
                    boxShadow: choices[permission.id] === 'allow' ? 'inset 0 0 0 2px rgba(255,255,255,0.6)' : 'none',
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
  );
}
