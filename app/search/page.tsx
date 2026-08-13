'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevant');

  const mockPlaces = [
    {
      id: 1,
      title: 'Dead Horse Bay',
      subtitle: 'A sea-glass shoreline built on a century of buried trash',
      address: 'Flatbush Ave & Aviation Rd, Brooklyn, NY',
      category: 'Hidden Beach',
    },
    {
      id: 2,
      title: 'Brooklyn Heights Promenade',
      subtitle: 'The skyline view New Yorkers actually go to',
      address: 'Brooklyn Heights Promenade, Brooklyn, NY',
      category: 'Scenic Lookout',
    },
    {
      id: 3,
      title: "Merchant's House Museum",
      subtitle: "A merchant family's home, untouched since 1835",
      address: '29 E 4th St, New York, NY',
      category: 'Historic Building',
    },
    {
      id: 4,
      title: 'The Ravine Cascades',
      subtitle: "Central Park's waterfall, hidden in plain sight",
      address: 'The Loch, Central Park, New York, NY',
      category: 'Waterfall',
    },
    {
      id: 5,
      title: 'The Bushwick Collective',
      subtitle: 'Open-air murals across a dozen industrial blocks',
      address: 'Troutman St & St Nicholas Ave, Brooklyn, NY',
      category: 'Street Art',
    },
    {
      id: 6,
      title: 'Moore Street Market',
      subtitle: "Bushwick's oldest Latin market, since 1941",
      address: '110 Moore St, Brooklyn, NY',
      category: 'Local Market',
    },
    {
      id: 7,
      title: 'Gantry Plaza State Park',
      subtitle: 'The best skyline photo you can take without a lens permit',
      address: '4-09 47th Rd, Long Island City, NY',
      category: 'Photography Spot',
    },
  ];

  const hasQuery = searchQuery.trim().length > 0;
  const searchResults = hasQuery
    ? mockPlaces.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  const noResults = hasQuery && searchResults.length === 0;

  const sortButtons = [
    { label: 'Most Relevant', key: 'relevant' },
    { label: 'Closest', key: 'closest' },
    { label: 'Most Saved', key: 'saved' },
    { label: 'Most Visited', key: 'visited' },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#FFFFFF' }}>
      <div style={{ width: '100%', maxWidth: '375px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Sticky Header */}
          <div style={{ padding: '58px 16px 12px', display: 'flex', flexDirection: 'column', gap: '10px', position: 'sticky', top: '0', background: 'oklch(98% 0.003 90)', zIndex: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => router.back()}
                aria-label="Back"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  margin: '0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '14px', padding: '10px 14px' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="rgba(10,10,10,0.5)" strokeWidth="2" />
                  <path d="M21 21l-4.3-4.3" stroke="rgba(10,10,10,0.5)" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Title, subtitle, or address"
                  style={{
                    border: 'none',
                    outline: 'none',
                    flex: 1,
                    fontSize: '14px',
                    background: 'transparent',
                    color: '#0A0A0A',
                    fontFamily: "'Inter',sans-serif",
                  }}
                />
              </div>
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#6B3FD1',
                  background: 'none',
                  border: 'none',
                  font: 'inherit',
                  textAlign: 'left',
                  padding: '0',
                  margin: '0',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Sort Tabs and Results */}
          {hasQuery && (
            <>
              {/* Sort Buttons */}
              <div style={{ padding: '2px 16px 14px', display: 'flex', gap: '8px', overflowX: 'auto', background: 'oklch(98% 0.003 90)' }}>
                {sortButtons.map((btn) => (
                  <button
                    key={btn.key}
                    onClick={() => setSortBy(btn.key)}
                    style={{
                      background: sortBy === btn.key ? '#3EE8A8' : '#fff',
                      color: sortBy === btn.key ? '#0A0A0A' : 'rgba(10,10,10,0.6)',
                      border: sortBy === btn.key ? 'none' : '1px solid rgba(10,10,10,0.08)',
                      borderRadius: '999px',
                      padding: '7px 14px',
                      fontSize: '12.5px',
                      fontWeight: sortBy === btn.key ? '600' : '400',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Search Results */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 24px' }}>
                {noResults ? (
                  <div style={{ padding: '40px 10px', textAlign: 'center', fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>
                    No places match your search.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {searchResults.map((place, idx) => (
                      <button
                        key={place.id}
                        onClick={() => router.push(`/place/${place.id}`)}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          padding: '12px 0',
                          borderWidth: '0 0 1px 0',
                          borderStyle: 'solid',
                          borderColor: 'rgba(10,10,10,0.07)',
                          width: '100%',
                          background: 'none',
                          font: 'inherit',
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <div
                          style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '10px',
                            background: '#E8D5F2',
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
                          <span style={{ fontSize: '14px', fontWeight: '700', color: '#0A0A0A' }}>{place.title}</span>
                          <span style={{ fontSize: '12px', color: 'rgba(10,10,10,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {place.subtitle}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: 'rgba(10,10,10,0.5)' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                              <path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="#2E7FE8" strokeWidth="2" />
                              <circle cx="12" cy="9.5" r="2.3" stroke="#2E7FE8" strokeWidth="2" />
                            </svg>
                            {place.address}
                          </div>
                          <span style={{ fontSize: '11px', color: '#6B3FD1' }}>{place.category}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Recent Searches */}
          {!hasQuery && (
            <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto', background: 'oklch(98% 0.003 90)' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', textTransform: 'uppercase' }}>
                Recent searches
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['park', 'beach', 'museum', 'lookout'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    style={{
                      background: '#fff',
                      border: '1px solid rgba(10,10,10,0.08)',
                      borderRadius: '999px',
                      padding: '7px 14px',
                      fontSize: '12.5px',
                      color: '#0A0A0A',
                      cursor: 'pointer',
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div
          style={{
            background: '#FFFFFF',
            borderTop: '1px solid rgba(0,0,0,0.08)',
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%',
            paddingBottom: '8px',
          }}
        >
          <Link href="/" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', cursor: 'pointer', textDecoration: 'none', paddingTop: '8px' }}>
            <div style={{ fontSize: '23px', lineHeight: '1' }}>⌂</div>
            <span>Home</span>
          </Link>

          <Link href="/search" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: '#6B3FD1', cursor: 'pointer', textDecoration: 'none', paddingTop: '8px' }}>
            <div style={{ fontSize: '23px', lineHeight: '1' }}>⌕</div>
            <span>Search</span>
          </Link>

          <Link href="/saved" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', cursor: 'pointer', textDecoration: 'none', paddingTop: '8px' }}>
            <div style={{ fontSize: '23px', lineHeight: '1' }}>♥</div>
            <span>Saved</span>
          </Link>

          <Link href="/visited" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', cursor: 'pointer', textDecoration: 'none', paddingTop: '8px' }}>
            <div style={{ fontSize: '23px', lineHeight: '1' }}>✓</div>
            <span>Visited</span>
          </Link>

          <Link href="/account" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', cursor: 'pointer', textDecoration: 'none', paddingTop: '8px' }}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" style={{ lineHeight: '1' }}>
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span>Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
