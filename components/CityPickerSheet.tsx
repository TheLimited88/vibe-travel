'use client';

import { useExploringCity } from '@/components/ExploringCityProvider';

export default function CityPickerSheet() {
  const { pickerOpen, closePicker, cityQuery, setCityQuery, cityOptions, activeCity, selectCity, resetLocation } = useExploringCity();

  if (!pickerOpen) return null;

  return (
    <div
      onClick={closePicker}
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.4)', zIndex: 1030, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '375px', background: '#fff', borderRadius: '20px 20px 0 0', padding: '10px 16px 24px', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ width: '36px', height: '4px', background: 'rgba(10,10,10,0.15)', borderRadius: '999px', margin: '2px auto 14px' }} />
        <div style={{ fontSize: '15px', fontWeight: 800, color: '#0A0A0A', marginBottom: '10px' }}>Where are you exploring?</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F4F2F8', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '12px', padding: '10px 13px', marginBottom: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="rgba(10,10,10,0.5)" strokeWidth="2" />
            <path d="M21 21l-4.3-4.3" stroke="rgba(10,10,10,0.5)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            placeholder="Search a city"
            aria-label="Search a city"
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px', background: 'transparent', color: '#0A0A0A', fontFamily: "'Inter',sans-serif" }}
          />
        </div>
        <button
          onClick={resetLocation}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', padding: '13px 4px', fontSize: '14px', fontWeight: 700, color: '#6B3FD1', textAlign: 'left', width: '100%', cursor: 'pointer', borderBottom: '1px solid rgba(10,10,10,0.06)' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="#6B3FD1" strokeWidth="2" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#6B3FD1" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="8" stroke="#6B3FD1" strokeWidth="1.4" />
          </svg>
          Use my current location
        </button>
        {cityOptions.map((city) => {
          const active = activeCity === city.name;
          return (
            <button
              key={city.name}
              onClick={() => selectCity(city.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                background: 'none',
                border: 'none',
                padding: '13px 4px',
                textAlign: 'left',
                width: '100%',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(10,10,10,0.06)',
                fontWeight: active ? 700 : 600,
                color: active ? '#6B3FD1' : '#0A0A0A',
              }}
            >
              <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '14px' }}>{city.name}</span>
                <span style={{ fontSize: '11.5px', fontWeight: 500, color: 'rgba(10,10,10,0.5)' }}>{city.country}</span>
              </span>
              {active && <span style={{ fontSize: '13px', color: '#6B3FD1' }}>✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
