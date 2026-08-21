'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const isMapPage = pathname === '/map';

  return (
    <header
      style={{
        padding: '20px 16px 10px',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <img
          src="/vibe-travel-logo-v2-cropped.png"
          alt="Vibe Travel"
          style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => router.push(isMapPage ? '/' : '/map')}
            aria-label={isMapPage ? 'Tile view' : 'Map view'}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'white',
              border: '1px solid rgba(10, 10, 10, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              padding: '0',
            }}
          >
            {isMapPage ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.8">
                <rect x="3" y="3" width="8" height="8" rx="1.5" />
                <rect x="13" y="3" width="8" height="8" rx="1.5" />
                <rect x="3" y="13" width="8" height="8" rx="1.5" />
                <rect x="13" y="13" width="8" height="8" rx="1.5" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0A0A0A"
                strokeWidth="1.6"
                strokeLinejoin="round"
              >
                <path d="M9 3L3 5v16l6-2 6 2 6-2V3l-6 2-6-2z" />
                <path d="M9 3v16M15 5v16" strokeWidth="1.6" />
              </svg>
            )}
          </button>
          <button
            onClick={() => router.push('/account')}
            aria-label="Account"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '999px',
              background: user ? '#7F53F3' : 'rgba(10,10,10,0.6)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              padding: '0',
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
