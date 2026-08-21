'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Home',
    icon: (
      <>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </>
    ),
  },
  {
    href: '/search',
    label: 'Search',
    icon: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
  },
  {
    href: '/saved',
    label: 'Saved',
    icon: (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    ),
  },
  {
    href: '/visited',
    label: 'Visited',
    icon: <polyline points="20 6 9 17 4 12" />,
  },
  {
    href: '/account',
    label: 'Account',
    icon: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(5px)',
        borderTop: '1px solid rgba(10, 10, 10, 0.07)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '72px',
        pointerEvents: 'auto',
        flexShrink: 0,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: active ? '#7F53F3' : 'rgba(10, 10, 10, 0.6)',
              fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 600,
              padding: '8px 0',
              position: 'relative',
              minWidth: '50px',
              textDecoration: 'none',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: '4px' }}>
              {item.icon}
            </svg>
            <div style={{ fontSize: '8.4px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'visible', width: 'auto' }}>{item.label}</div>
          </Link>
        );
      })}
    </nav>
  );
}
