'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import CategoryChips from '@/components/CategoryChips';
import LocationCard from '@/components/LocationCard';
import BottomNav from '@/components/BottomNav';
import BeforeExploreModal from '@/components/BeforeExploreModal';
import TermsPoliciesModal from '@/components/TermsPoliciesModal';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
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
}

function placeToLocation(place: PlaceApiRecord): Location {
  return {
    id: place.slug,
    name: place.title,
    category: place.category,
    distance: 0,
    visits: 0,
    likes: 0,
    image: place.heroImage?.url || '',
    description: place.subtitle,
    lat: place.lat ?? undefined,
    lng: place.lng ?? undefined,
  };
}

const CITY_OPTIONS = [
  { name: 'New York', country: 'United States' },
  { name: 'Paris', country: 'France' },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationPermission, setLocationPermission] = useState<PermissionState | 'unsupported'>('unsupported');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>('unsupported');
  const [permissionToast, setPermissionToast] = useState('');
  const [exploringCity, setExploringCity] = useState<string | null>(null);
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState('');

  useEffect(() => {
    fetch('/api/admin/places')
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

  const isRemoteCity = !!exploringCity;
  const activeCity = exploringCity || 'New York';
  const locationLabel = isRemoteCity ? activeCity : 'Near me';

  // All real places in this app are New York — picking any other city is an
  // honest empty state rather than fabricated results for a place we have no
  // real data for.
  const cityLocations = isRemoteCity ? [] : locations;

  const filteredLocations = cityLocations.filter((location) => {
    return selectedCategory === 'all' || location.category === selectedCategory;
  });

  const nearYou = filteredLocations.slice(0, 1);
  const popular = filteredLocations.slice(0, 2);
  const trending = isRemoteCity ? [] : filteredLocations.slice(0, 4);
  const noTiles = filteredLocations.length === 0;

  const selectCity = (city: string) => {
    setExploringCity(city === 'New York' ? null : city);
    setSelectedCategory('all');
    setCityPickerOpen(false);
  };

  const cityOptions = CITY_OPTIONS.filter(
    (c) => !cityQuery.trim() || c.name.toLowerCase().includes(cityQuery.trim().toLowerCase())
  );

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

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <button
                onClick={() => { setCityQuery(''); setCityPickerOpen(true); }}
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
                  onClick={() => setExploringCity(null)}
                  style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', fontSize: '12px', fontWeight: 600, color: '#6B3FD1', cursor: 'pointer' }}
                >
                  Back to my location
                </button>
              )}
            </div>

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
                      {'< 0.75 mi'}
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
                      {'< 2 mi'}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '0 16px', justifyContent: 'flex-start' }}>
                  {popular.map((location) => (
                    <LocationCard key={location.id} location={location} layout="scroll" showDistance={true} flexGrow={false} />
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

            {cityPickerOpen && (
              <div
                onClick={() => setCityPickerOpen(false)}
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
                    onClick={() => { setExploringCity(null); setCityPickerOpen(false); }}
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
            )}
          </main>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
