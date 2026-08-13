'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function SavedPage() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [searchQuery, setSearchQuery] = useState('');

  const mockPlaces = [
    {
      id: 1,
      title: 'Dead Horse Bay',
      subtitle: 'A sea-glass shoreline built on a century of buried trash',
      address: 'Flatbush Ave & Aviation Rd, Brooklyn, NY',
      category: 'Hidden Beach',
      icon: 'beach',
    },
    {
      id: 2,
      title: 'Brooklyn Heights Promenade',
      subtitle: 'The skyline view New Yorkers actually go to',
      address: 'Brooklyn Heights Promenade, Brooklyn, NY',
      category: 'Scenic Lookout',
      icon: 'lookout',
    },
    {
      id: 7,
      title: 'Gantry Plaza State Park',
      subtitle: 'The best skyline photo you can take without a lens permit',
      address: '4-09 47th Rd, Long Island City, NY',
      category: 'Photography Spot',
      icon: 'photo',
    },
  ];

  const filteredPlaces = searchQuery
    ? mockPlaces.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockPlaces;

  const noSaved = isSignedIn && filteredPlaces.length === 0;

  const getCategoryColor = (icon: string) => {
    const colors: { [key: string]: string } = {
      beach: '#FF6B6B',
      lookout: '#6B3FD1',
      photo: '#FFB84D',
      historic: '#4ECDC4',
      waterfall: '#45B7D1',
      trail: '#96CEB4',
      market: '#FFEAA7',
      arch: '#DDA15E',
      quiet: '#B8860B',
      street: '#FF8C42',
    };
    return colors[icon] || '#6B3FD1';
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#FFFFFF' }}>
      <div style={{ width: '100%', maxWidth: '375px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '58px 16px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => router.back()}
                aria-label="Back"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '999px',
                  background: '#fff',
                  border: '1px solid rgba(10,10,10,0.08)',
                  cursor: 'pointer',
                  fontSize: '24px',
                }}
              >
                ‹
              </button>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#0A0A0A' }}>Saved Places</div>
            </div>

            {/* Sign-in Prompt */}
            {!isSignedIn && (
              <div style={{
                background: '#fff',
                borderRadius: '18px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                alignItems: 'center',
                textAlign: 'center',
                border: '1px solid rgba(10,10,10,0.06)',
              }}>
                <div style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>
                  Sign in to see your saved places.
                </div>
                <button
                  onClick={() => router.push('/auth/signup')}
                  style={{
                    background: 'linear-gradient(135deg,#95048B,#6B3FD1)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '11px 22px',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  Sign in
                </button>
              </div>
            )}

            {/* Signed-in Content */}
            {isSignedIn && (
              <>
                {/* Search */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#fff',
                  border: '1px solid rgba(10,10,10,0.08)',
                  borderRadius: '14px',
                  padding: '10px 14px',
                  width: '100%',
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="rgba(10,10,10,0.5)" strokeWidth="2" />
                    <path d="M21 21l-4.3-4.3" stroke="rgba(10,10,10,0.5)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search saved Places"
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

                {/* View Toggle */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setViewMode('list')}
                    style={{
                      background: viewMode === 'list' ? '#6B3FD1' : '#fff',
                      color: viewMode === 'list' ? '#fff' : '#0A0A0A',
                      border: viewMode === 'list' ? 'none' : '1px solid rgba(10,10,10,0.08)',
                      borderRadius: '999px',
                      padding: '8px 16px',
                      fontSize: '13px',
                      fontWeight: viewMode === 'list' ? '600' : '500',
                      cursor: 'pointer',
                    }}
                  >
                    ☰ List
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    style={{
                      background: viewMode === 'map' ? '#6B3FD1' : '#fff',
                      color: viewMode === 'map' ? '#fff' : '#0A0A0A',
                      border: viewMode === 'map' ? 'none' : '1px solid rgba(10,10,10,0.08)',
                      borderRadius: '999px',
                      padding: '8px 16px',
                      fontSize: '13px',
                      fontWeight: viewMode === 'map' ? '600' : '500',
                      cursor: 'pointer',
                    }}
                  >
                    ⬥ Map
                  </button>
                </div>
              </>
            )}
          </div>

          {/* List View */}
          {isSignedIn && viewMode === 'list' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {noSaved ? (
                <div style={{ padding: '40px 10px', textAlign: 'center', fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>
                  Nothing saved yet — tap the heart on any place.
                </div>
              ) : (
                filteredPlaces.map((place) => (
                  <div
                    key={place.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      background: '#fff',
                      borderRadius: '14px',
                      padding: '10px',
                      border: '1px solid rgba(10,10,10,0.06)',
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
                    <button
                      onClick={() => router.push(`/place/${place.id}`)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '3px',
                        minWidth: 0,
                        background: 'none',
                        border: 'none',
                        font: 'inherit',
                        textAlign: 'left',
                        padding: '0',
                        margin: '0',
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0A0A0A' }}>{place.title}</span>
                      <span style={{ fontSize: '12px', color: 'rgba(10,10,10,0.6)' }}>{place.subtitle}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: 'rgba(10,10,10,0.5)' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                          <path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="#2E7FE8" strokeWidth="2" />
                          <circle cx="12" cy="9.5" r="2.3" stroke="#2E7FE8" strokeWidth="2" />
                        </svg>
                        {place.address}
                      </div>
                      <span style={{ fontSize: '11px', color: '#6B3FD1' }}>{place.category}</span>
                    </button>
                    <button
                      onClick={() => alert('Unsave: ' + place.title)}
                      aria-label="Remove from saved"
                      style={{
                        alignSelf: 'flex-start',
                        width: '44px',
                        height: '44px',
                        borderRadius: '999px',
                        background: 'rgba(10,10,10,0.05)',
                        border: 'none',
                        fontSize: '20px',
                        color: 'rgba(10,10,10,0.6)',
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Map View */}
          {isSignedIn && viewMode === 'map' && (
            <div style={{
              flex: 1,
              position: 'relative',
              background: 'linear-gradient(135deg, #F5F3F0 0%, #F0EBE6 100%)',
              backgroundImage: 'linear-gradient(135deg, #F5F3F0 0%, #F0EBE6 100%), repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(0,0,0,.02) 35px, rgba(0,0,0,.02) 70px)',
              margin: '0 16px 24px 16px',
              borderRadius: '14px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* Map pins */}
              {filteredPlaces.map((place, idx) => (
                <button
                  key={place.id}
                  onClick={() => router.push(`/place/${place.id}`)}
                  style={{
                    position: 'absolute',
                    width: '44px',
                    height: '44px',
                    borderRadius: '999px',
                    background: getCategoryColor(place.icon),
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.16)',
                    left: `${20 + idx * 30}px`,
                    top: `${40 + idx * 25}px`,
                    padding: 0,
                  }}
                >
                  {place.icon === 'beach' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M3 13c2 0 2-3 4-3s2 3 4 3 2-3 4-3 2 3 4 3 2-3 4-3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
                      <path d="M3 15c2 0 2-3 4-3s2 3 4 3 2-3 4-3 2 3 4 3 2-3 4-3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  )}
                  {place.icon === 'lookout' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M3 19l6-10 4 6 3-4 5 8H3z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
                    </svg>
                  )}
                  {place.icon === 'photo' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="7" width="18" height="13" rx="2" stroke="#fff" strokeWidth="1.8"/>
                      <path d="M8 7l1.5-2.5h5L16 7" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
                      <circle cx="12" cy="13.5" r="3.5" stroke="#fff" strokeWidth="1.8"/>
                    </svg>
                  )}
                  {place.icon === 'waterfall' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M8 3c0 4-3 4-3 8s3 4 3 8M16 3c0 4-3 4-3 8s3 4 3 8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>
              ))}

              {/* Map Controls */}
              <button
                aria-label="Toggle satellite view"
                style={{
                  position: 'absolute',
                  bottom: '120px',
                  right: '16px',
                  width: '44px',
                  height: '44px',
                  borderRadius: '999px',
                  background: '#fff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.16)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L3 8.5l9 5.5 9-5.5L12 3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
                  <path d="M3 14l9 5.5 9-5.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </button>

              <button
                aria-label="Toggle fullscreen map"
                style={{
                  position: 'absolute',
                  bottom: '70px',
                  right: '16px',
                  width: '44px',
                  height: '44px',
                  borderRadius: '999px',
                  background: '#fff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.16)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M8 3H4a1 1 0 00-1 1v4M16 3h4a1 1 0 011 1v4M8 21H4a1 1 0 01-1-1v-4M16 21h4a1 1 0 001-1v-4" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button
                onClick={() => alert('Recenter map')}
                aria-label="Recenter map on my location"
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  width: '44px',
                  height: '44px',
                  borderRadius: '999px',
                  background: '#fff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.16)',
                }}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" stroke="#4285F4" strokeWidth="1.9" />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#4285F4" strokeWidth="1.9" strokeLinecap="round" />
                </svg>
              </button>
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

          <Link href="/search" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', cursor: 'pointer', textDecoration: 'none', paddingTop: '8px' }}>
            <div style={{ fontSize: '23px', lineHeight: '1' }}>⌕</div>
            <span>Search</span>
          </Link>

          <Link href="/saved" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: '#6B3FD1', cursor: 'pointer', textDecoration: 'none', paddingTop: '8px' }}>
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
