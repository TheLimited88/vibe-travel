'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import CategoryChips from '@/components/CategoryChips';
import LocationCard from '@/components/LocationCard';
import LocationPill from '@/components/LocationPill';
import BottomNav from '@/components/BottomNav';
import BeforeExploreModal from '@/components/BeforeExploreModal';
import TermsPoliciesModal from '@/components/TermsPoliciesModal';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { useExploringCity } from '@/components/ExploringCityProvider';
import { useDistanceUnit } from '@/components/DistanceUnitProvider';
import { haversineMi } from '@/lib/geo';
import type { Location } from '@/types';

interface PlaceApiRecord {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  address: string;
  lat: number | null;
  lng: number | null;
  heroImage: { url: string } | null;
  status: string;
  visits?: number;
  worthPct?: number | null;
}

function placeToLocation(place: PlaceApiRecord): Location {
  return {
    id: place.slug,
    name: place.title,
    category: place.category,
    distance: null,
    visits: place.visits ?? 0,
    likes: 0,
    image: place.heroImage?.url || '',
    description: place.subtitle,
    lat: place.lat ?? undefined,
    lng: place.lng ?? undefined,
    worthPct: place.worthPct ?? null,
  };
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationPermission, setLocationPermission] = useState<PermissionState | 'unsupported'>('unsupported');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>('unsupported');
  const [permissionToast, setPermissionToast] = useState('');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const { isRemoteCity, activeCity } = useExploringCity();
  const { unit } = useDistanceUnit();
  // Fixed radius labels (not a measured distance) — keep the mi side at its
  // exact designed precision instead of routing it through formatDistance's
  // 1-decimal rounding, which turns "0.75 mi" into a misleading "0.8 mi".
  const radiusLabel = (mi: number) => (unit === 'mi' ? `${mi} mi` : `${Math.round(mi * 1.60934 * 10) / 10} km`);

  useEffect(() => {
    fetch('/api/admin/places?includeStats=1')
      .then((r) => r.json())
      .then((data) => {
        const published = (data.places || []).filter((p: PlaceApiRecord) => p.status === 'published');
        setLocations(published.map(placeToLocation));
      })
      .catch(() => setLocations([]));
  }, []);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((status) => {
        setLocationPermission(status.state);
        status.onchange = () => setLocationPermission(status.state);
      }).catch(() => {});
    }
  }, []);

  // Only fetch position silently when permission is already granted — never
  // trigger a fresh browser prompt from here, that's the onboarding modal's
  // and the footer toggle's job.
  useEffect(() => {
    if (locationPermission === 'granted' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, [locationPermission]);

  const showPermissionToast = (msg: string) => {
    setPermissionToast(msg);
    setTimeout(() => setPermissionToast(''), 3000);
  };

  const handleLocationClick = () => {
    if (locationPermission === 'granted') {
      showPermissionToast('Location access is already on');
    } else if (locationPermission === 'denied') {
      showPermissionToast('Location is blocked — enable it for this site in your browser settings');
    } else if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationPermission('granted'),
        () => setLocationPermission('denied')
      );
    } else {
      showPermissionToast('Location is not supported on this device');
    }
  };

  const handleNotificationClick = async () => {
    if (notificationPermission === 'granted') {
      showPermissionToast('Notifications are already on');
    } else if (notificationPermission === 'denied') {
      showPermissionToast('Notifications are blocked — enable them for this site in your browser settings');
    } else if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setNotificationPermission(result);
    } else {
      showPermissionToast('Notifications are not supported on this device');
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // All real places in this app are New York — picking any other city is an
  // honest empty state rather than fabricated results for a place we have no
  // real data for.
  const cityLocations = isRemoteCity ? [] : locations;

  const locationsWithDistance = cityLocations.map((location) => ({
    ...location,
    distance:
      userCoords && location.lat != null && location.lng != null
        ? haversineMi(userCoords.lat, userCoords.lng, location.lat, location.lng)
        : null,
  }));

  const filteredLocations = locationsWithDistance.filter((location) => {
    return selectedCategory === 'all' || location.category === selectedCategory;
  });

  // Closest-first when we have real distances; otherwise leave the fetch
  // order alone rather than pretending we know which is nearest.
  const byDistance = [...filteredLocations].sort((a, b) => {
    if (a.distance == null && b.distance == null) return 0;
    if (a.distance == null) return 1;
    if (b.distance == null) return -1;
    return a.distance - b.distance;
  });

  const nearYou = byDistance.slice(0, 1);
  const popular = byDistance.slice(0, 2);
  const trending = isRemoteCity ? [] : filteredLocations.slice(0, 4);
  const noTiles = filteredLocations.length === 0;

  return (
    <div style={{ background: '#F9F8F6', height: '100vh', display: 'flex', justifyContent: 'center' }}>
      <BeforeExploreModal />
      <TermsPoliciesModal />
      <PWAInstallPrompt />
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          background: '#F9F8F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: -1,
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '375px',
          height: '100vh',
          background: '#F2F2F7',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ background: '#F4F2F8', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden' }}>
          <Header />

          <main style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
            <div style={{ paddingTop: '12px' }}>
              <Link
                href="/search"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#fff',
                  border: '1px solid rgba(10,10,10,0.08)',
                  borderRadius: '14px',
                  padding: '10px 14px',
                  width: '100%',
                  textDecoration: 'none',
                  marginBottom: '12px',
                  boxSizing: 'border-box',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="rgba(10,10,10,0.5)" strokeWidth="2" />
                  <path d="M21 21l-4.3-4.3" stroke="rgba(10,10,10,0.5)" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>Search for places, vibes or cities</span>
              </Link>
            </div>

            <LocationPill />

            <CategoryChips selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} />

            {/* Near you */}
            {nearYou.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '6px 0 4px', marginBottom: '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px' }}>
                  <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0A0A0A' }}>
                    {isRemoteCity ? `Around ${activeCity}` : 'Near you'}
                  </h2>
                  {!isRemoteCity && (
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#6B3FD1', background: 'rgba(127, 83, 243, 0.1)', padding: '3px 8px', borderRadius: '8px', display: 'inline-block' }}>
                      {`< ${radiusLabel(0.75)}`}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '0 16px', justifyContent: 'flex-start' }}>
                  {nearYou.map((location) => (
                    <LocationCard key={location.id} location={location} layout="scroll" showDistance={true} flexGrow={false} />
                  ))}
                </div>
              </div>
            )}

            {/* Popular */}
            {popular.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '6px 0 4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px' }}>
                  <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0A0A0A' }}>
                    Popular
                  </h2>
                  {!isRemoteCity && (
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#0A9B71', background: 'rgba(10, 155, 113, 0.1)', padding: '3px 8px', borderRadius: '8px', display: 'inline-block' }}>
                      {`< ${radiusLabel(2)}`}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '0 16px', justifyContent: 'flex-start' }}>
                  {popular.map((location) => (
                    <LocationCard key={location.id} location={location} layout="scroll" showDistance={true} showVisits={true} flexGrow={false} />
                  ))}
                </div>
              </div>
            )}

            {/* Trending */}
            {trending.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '6px 0 4px', marginBottom: '32px' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0A0A0A', padding: '0 16px' }}>
                  Trending in New York City
                </div>
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '0 16px' }}>
                  {trending.map((location) => (
                    <LocationCard key={location.id} location={location} layout="scroll" flexGrow={false} />
                  ))}
                </div>
              </div>
            )}

            {noTiles && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '60px 30px', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(10,10,10,0.06)' }} />
                <div style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>
                  {isRemoteCity ? `No places in ${activeCity} yet — check back soon.` : 'No places match this category. Try a different one.'}
                </div>
              </div>
            )}

            {/* Footer */}
            <footer style={{ borderTop: '1px solid rgba(10, 10, 10, 0.08)', paddingTop: '24px', marginTop: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px', fontSize: '11px', color: 'rgba(10, 10, 10, 0.5)', fontWeight: 500 }}>
                <Link href="/about" style={{ color: 'rgba(10, 10, 10, 0.5)', textDecoration: 'none' }}>About</Link>
                <Link href="/help" style={{ color: 'rgba(10, 10, 10, 0.5)', textDecoration: 'none' }}>Help</Link>
                <Link href="/legal/terms" style={{ color: 'rgba(10, 10, 10, 0.5)', textDecoration: 'none' }}>Terms of Service</Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px', fontSize: '11px', color: 'rgba(10, 10, 10, 0.5)', fontWeight: 500 }}>
                <Link href="/legal/privacy" style={{ color: 'rgba(10, 10, 10, 0.5)', textDecoration: 'none' }}>Privacy Policy</Link>
                <Link href="/legal/acceptable-use" style={{ color: 'rgba(10, 10, 10, 0.5)', textDecoration: 'none' }}>Acceptable Use</Link>
                <Link href="/legal/cookies" style={{ color: 'rgba(10, 10, 10, 0.5)', textDecoration: 'none' }}>Cookie Policy</Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '11px', color: 'rgba(10, 10, 10, 0.5)', fontWeight: 500 }}>
                <button
                  onClick={handleLocationClick}
                  style={{ background: 'none', border: 'none', padding: 0, margin: 0, font: 'inherit', textAlign: 'left', color: 'rgba(10, 10, 10, 0.5)', cursor: 'pointer' }}
                >
                  Location: {locationPermission === 'granted' ? 'On' : 'Off'}
                </button>
                <button
                  onClick={handleNotificationClick}
                  style={{ background: 'none', border: 'none', padding: 0, margin: 0, font: 'inherit', textAlign: 'left', color: 'rgba(10, 10, 10, 0.5)', cursor: 'pointer' }}
                >
                  Notifications: {notificationPermission === 'granted' ? 'On' : 'Off'}
                </button>
                <Link href="/accessibility" style={{ color: 'rgba(10, 10, 10, 0.5)', textDecoration: 'none' }}>Accessibility</Link>
              </div>
            </footer>

            {permissionToast && (
              <div
                style={{
                  position: 'fixed',
                  bottom: '80px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#0A0A0A',
                  color: '#fff',
                  padding: '10px 18px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 600,
                  zIndex: 1020,
                  maxWidth: '90%',
                  textAlign: 'center',
                }}
              >
                {permissionToast}
              </div>
            )}
          </main>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
