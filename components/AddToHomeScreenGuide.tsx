'use client';

import { ReactNode, CSSProperties } from 'react';

interface AddToHomeScreenGuideProps {
  device: 'ios' | 'android';
  onDeviceChange: (device: 'ios' | 'android') => void;
  onDone: () => void;
  onClose?: () => void;
  title?: string;
  showDeviceTabs?: boolean;
}

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

function StepRow({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
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
      <div style={{ fontSize: '14px', color: '#0A0A0A', lineHeight: '1.5' }}>{children}</div>
    </div>
  );
}

// Shared "how to add this to your home screen" content — one source of
// truth used both by the first-run onboarding modal and by the later
// standalone nudge for iOS visitors who skipped it the first time.
export default function AddToHomeScreenGuide({ device, onDeviceChange, onDone, onClose, title = 'Install Vibe Travel', showDeviceTabs = true }: AddToHomeScreenGuideProps) {
  return (
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
        <div style={{ fontSize: '16px', fontWeight: 800, color: '#0A0A0A' }}>{title}</div>
        {onClose && (
          <button
            onClick={onClose}
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
        )}
      </div>

      {showDeviceTabs && (
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => onDeviceChange('ios')} style={tabStyle(device === 'ios')}>
            iPhone (Safari)
          </button>
          <button onClick={() => onDeviceChange('android')} style={tabStyle(device === 'android')}>
            Android (Chrome)
          </button>
        </div>
      )}

      {device === 'ios' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <StepRow n={1}>
            Tap the menu{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: '-2px' }}>
              <path d="M12 3v13M7 8l5-5 5 5" stroke="#7F53F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="4" y="17" width="16" height="4" rx="1" stroke="#7F53F3" strokeWidth="2" />
            </svg>{' '}
            Share icon in the bottom toolbar.
          </StepRow>
          <StepRow n={2}>
            Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.
          </StepRow>
          <StepRow n={3}>
            Tap <strong style={{ color: '#6B3FD1' }}>Add</strong> in the top right corner.
          </StepRow>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <StepRow n={1}>
            Tap the{' '}
            <svg width="4" height="14" viewBox="0 0 4 14" fill="none" style={{ verticalAlign: '-2px' }}>
              <circle cx="2" cy="2" r="2" fill="#7F53F3" />
              <circle cx="2" cy="7" r="2" fill="#7F53F3" />
              <circle cx="2" cy="12" r="2" fill="#7F53F3" />
            </svg>{' '}
            3-dot menu at the top right.
          </StepRow>
          <StepRow n={2}>
            Select <strong>&quot;Add to Home Screen&quot;</strong> or <strong>&quot;Install App&quot;</strong>.
          </StepRow>
          <StepRow n={3}>
            Confirm by tapping <strong style={{ color: '#6B3FD1' }}>Install</strong> or <strong style={{ color: '#6B3FD1' }}>Add</strong>.
          </StepRow>
        </div>
      )}

      <button
        onClick={onDone}
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
  );
}
