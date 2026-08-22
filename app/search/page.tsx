'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CategoryChips from '@/components/CategoryChips';
import LocationPill from '@/components/LocationPill';
import BottomNav from '@/components/BottomNav';
import { useExploringCity } from '@/components/ExploringCityProvider';
import { categories } from '@/data/categories';
import { haversineMi } from '@/lib/geo';
import { geolocationOptions } from '@/lib/pwaDisplayMode';

interface PlaceApiRecord {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  vibes: string[];
  address: string;
  lat: number | null;
  lng: number | null;
  heroImage: { url: string } | null;
  status: string;
  visits?: number;
  saves?: number;
}

const RECENT_SEARCHES = ['Coffee', 'Rooftop bar', 'Murals', 'Vintage shop'];

type SortMode = 'relevant' | 'closest' | 'saved' | 'visited';

export default function SearchPage() {
  const router = useRouter();
  const { isRemoteCity } = useExploringCity();
  const [places, setPlaces] = useState<PlaceApiRecord[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortMode>('relevant');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetch('/api/admin/places?includeStats=1')
      .then((r) => r.json())
      .then((data) => {
        const published = (data.places || []).filter((p: PlaceApiRecord) => p.status === 'published');
        setPlaces(published);
      })
      .catch(() => setPlaces([]));
  }, []);

  useEffect(() => {
    if (sortBy === 'closest' && !userCoords && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        geolocationOptions()
      );
    }
  }, [sortBy, userCoords]);

  const q = query.trim().toLowerCase();
  const searchActive = q.length > 0 || selectedCategory !== 'all';

  // All real places are New York — a remote city is an honest empty state.
  const cityPlaces = isRemoteCity ? [] : places;

  let matches = searchActive
    ? cityPlaces.filter(
        (p) =>
          (selectedCategory === 'all' || p.category === selectedCategory) &&
          (!q ||
            p.title.toLowerCase().includes(q) ||
            p.subtitle.toLowerCase().includes(q) ||
            p.address.toLowerCase().includes(q) ||
            (p.vibes || []).some((v) => v.toLowerCase().includes(q)))
      )
    : [];

  if (sortBy === 'closest' && userCoords) {
    matches = [...matches].sort((a, b) => {
      const da = a.lat != null && a.lng != null ? haversineMi(userCoords.lat, userCoords.lng, a.lat, a.lng) : Infinity;
      const db = b.lat != null && b.lng != null ? haversineMi(userCoords.lat, userCoords.lng, b.lat, b.lng) : Infinity;
      return da - db;
    });
  } else if (sortBy === 'saved') {
    matches = [...matches].sort((a, b) => (b.saves ?? 0) - (a.saves ?? 0));
  } else if (sortBy === 'visited') {
    matches = [...matches].sort((a, b) => (b.visits ?? 0) - (a.visits ?? 0));
  }

  const searchResults = matches.slice(0, 20);
  const noResults = searchActive && searchResults.length === 0;

  const sortButtons: { label: string; key: SortMode }[] = [
    { label: 'Most Relevant', key: 'relevant' },
    { label: 'Closest', key: 'closest' },
    { label: 'Most Saved', key: 'saved' },
    { label: 'Most Visited', key: 'visited' },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#FFFFFF' }}>
      <div style={{ width: '100%', maxWidth: '375px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Sticky Header */}
          <div style={{ padding: '58px 16px 12px', display: 'flex', flexDirection: 'column', gap: '10px', position: 'sticky', top: '0', background: 'oklch(98% 0.003 90)', zIndex: 5 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <img src="/vibe-travel-logo-v2-cropped.png" alt="Vibe Travel" style={{ height: '28px', width: 'auto', objectFit: 'contain', alignSelf: 'flex-start' }} />
              <span style={{ fontSize: '11px', fontWeight: 500, color: '#9F6BE8', paddingLeft: '3px', marginTop: '1px', display: 'block', letterSpacing: '1.05px', whiteSpace: 'nowrap' }}>
                Find your kind of place
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => router.back()}
                aria-label="Back"
                style={{ background: 'none', border: 'none', padding: '4px', margin: '0', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}
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
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Title, address, or vibe"
                  placeholder="Search for places, vibes or cities"
                  style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px', background: 'transparent', color: '#0A0A0A', fontFamily: "'Inter',sans-serif" }}
                />
              </div>
            </div>

            <LocationPill />

            <CategoryChips selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          </div>

          {searchActive ? (
            <>
              {/* Sort Buttons */}
              <div style={{ padding: '2px 16px 14px', display: 'flex', gap: '8px', overflowX: 'auto', background: 'oklch(98% 0.003 90)' }}>
                {sortButtons.map((btn) => (
                  <button
                    key={btn.key}
                    onClick={() => setSortBy(btn.key)}
                    style={{
                      background: sortBy === btn.key ? 'rgba(62,232,168,0.15)' : '#fff',
                      color: '#0A0A0A',
                      border: sortBy === btn.key ? '1px solid #3EE8A8' : '1px solid rgba(10,10,10,0.12)',
                      borderRadius: '999px',
                      padding: '7px 12px',
                      fontSize: '12.5px',
                      fontWeight: 600,
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
                    {searchResults.map((place) => {
                      const category = categories.find((c) => c.key === place.category) || categories[0];
                      return (
                        <button
                          key={place.slug}
                          onClick={() => router.push(`/place/${place.slug}`)}
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
                          {place.heroImage ? (
                            <img
                              src={place.heroImage.url}
                              alt={place.title}
                              style={{ width: '72px', height: '72px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                            />
                          ) : (
                            <div style={{ width: '72px', height: '72px', borderRadius: '10px', background: category.color, flexShrink: 0 }} />
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: '#0A0A0A' }}>{place.title}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: category.color }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" dangerouslySetInnerHTML={{ __html: category.icon.replace(/#fff/g, category.color) }} />
                              {category.label}
                            </span>
                            {place.vibes && place.vibes.length > 0 && (
                              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                {place.vibes.map((v) => (
                                  <span key={v} style={{ fontSize: '10px', fontWeight: 600, color: '#0A9B71', background: 'rgba(10,155,113,0.1)', borderRadius: '999px', padding: '2px 8px', whiteSpace: 'nowrap' }}>
                                    {v}
                                  </span>
                                ))}
                              </div>
                            )}
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
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto', background: 'oklch(98% 0.003 90)' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', textTransform: 'uppercase' }}>
                Recent searches
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {RECENT_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
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

        <BottomNav />
      </div>
    </div>
  );
}
