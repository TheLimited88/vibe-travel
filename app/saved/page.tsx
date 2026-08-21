'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import MapView, { type PlaceApiRecord } from '@/components/MapView';
import { categories } from '@/data/categories';

interface SavedPlace extends PlaceApiRecord {
  savedAt: number;
}

function SavedThumbnail({ place }: { place: SavedPlace }) {
  const [imgError, setImgError] = useState(false);
  const category = categories.find((c) => c.key === place.category) || categories[0];

  if (place.heroImage && !imgError) {
    return (
      <img
        src={place.heroImage.url}
        alt={place.title}
        onError={() => setImgError(true)}
        style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
      />
    );
  }

  return (
    <div
      style={{
        width: '64px',
        height: '64px',
        borderRadius: '10px',
        background: category.color,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" dangerouslySetInnerHTML={{ __html: category.icon }} />
    </div>
  );
}

export default function SavedPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<SavedPlace[] | null>(null);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [removingSlug, setRemovingSlug] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setPlaces(null);
      setLoadingPlaces(false);
      return;
    }
    setLoadingPlaces(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/places/saved', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setPlaces(res.ok ? data.places : []);
    } catch {
      setPlaces([]);
    } finally {
      setLoadingPlaces(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    refresh();
  }, [authLoading, refresh]);

  const handleUnsave = async (slug: string) => {
    if (!user || removingSlug) return;
    setRemovingSlug(slug);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/places/${encodeURIComponent(slug)}/save`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPlaces((prev) => (prev ? prev.filter((p) => p.slug !== slug) : prev));
      }
    } finally {
      setRemovingSlug(null);
    }
  };

  const isSignedIn = !authLoading && !!user;
  const isLoading = authLoading || loadingPlaces;
  const allPlaces = places || [];

  const filteredPlaces = searchQuery
    ? allPlaces.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allPlaces;

  const noSavedAtAll = isSignedIn && !isLoading && allPlaces.length === 0;
  const noSearchMatches = isSignedIn && !isLoading && allPlaces.length > 0 && filteredPlaces.length === 0;

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
            {!authLoading && !user && (
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
              {isLoading ? (
                <div style={{ padding: '40px 10px', textAlign: 'center', fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>
                  Loading…
                </div>
              ) : noSavedAtAll ? (
                <div style={{ padding: '40px 10px', textAlign: 'center', fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>
                  Nothing saved yet — tap the heart on any place.
                </div>
              ) : noSearchMatches ? (
                <div style={{ padding: '40px 10px', textAlign: 'center', fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>
                  No saved places match your search.
                </div>
              ) : (
                filteredPlaces.map((place) => (
                  <div
                    key={place.slug}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      background: '#fff',
                      borderRadius: '14px',
                      padding: '10px',
                      border: '1px solid rgba(10,10,10,0.06)',
                    }}
                  >
                    <SavedThumbnail place={place} />
                    <button
                      onClick={() => router.push(`/place/${place.slug}`)}
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
                      <span style={{ fontSize: '11px', color: '#6B3FD1' }}>
                        {(categories.find((c) => c.key === place.category) || categories[0]).label}
                      </span>
                    </button>
                    <button
                      onClick={() => handleUnsave(place.slug)}
                      disabled={removingSlug === place.slug}
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
                        cursor: removingSlug === place.slug ? 'default' : 'pointer',
                        opacity: removingSlug === place.slug ? 0.6 : 1,
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
            <div style={{ flex: 1, position: 'relative', margin: '0 16px 24px 16px', borderRadius: '14px', overflow: 'hidden' }}>
              {isLoading ? (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F3F0', fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>
                  Loading…
                </div>
              ) : (
                <MapView places={allPlaces} searchQuery={searchQuery} />
              )}
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
