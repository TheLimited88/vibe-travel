'use client';

import { useExploringCity } from '@/components/ExploringCityProvider';

export default function LocationPill() {
  const { locationLabel, isRemoteCity, openPicker, resetLocation } = useExploringCity();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
      <button
        onClick={openPicker}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: '#fff',
          border: '1px solid rgba(10,10,10,0.1)',
          borderRadius: '999px',
          padding: '7px 12px',
          fontSize: '12.5px',
          fontWeight: 700,
          color: '#0A0A0A',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="#6B3FD1" strokeWidth="1.8" />
          <circle cx="12" cy="9.5" r="2.3" stroke="#6B3FD1" strokeWidth="1.8" />
        </svg>
        {locationLabel}
        <span style={{ fontSize: '9px', color: 'rgba(10,10,10,0.45)' }}>▾</span>
      </button>
      {isRemoteCity && (
        <button
          onClick={resetLocation}
          style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', fontSize: '12px', fontWeight: 600, color: '#6B3FD1', cursor: 'pointer' }}
        >
          Back to my location
        </button>
      )}
    </div>
  );
}
