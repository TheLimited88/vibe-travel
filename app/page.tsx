'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
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

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationPermission, setLocationPermission] = useState<PermissionState | 'unsupported'>('unsupported');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>('unsupported');
  const [permissionToast, setPermissionToast] = useState('');

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
    (window as any).__debugToast = (window as any).__debugToast || [];
    (window as any).__debugToast.push('showPermissionToast called with: ' + msg);
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
    (window as any).__debugToast = (window as any).__debugToast || [];
    (window as any).__debugToast.push('handleNotificationClick called, current state: ' + notificationPermission);
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

  const filteredLocations = locations.filter((location) => {
    const matchesCategory = selectedCategory === 'all' || location.category === selectedCategory;
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const nearYou = filteredLocations.slice(0, 1);
  const popular = filteredLocations.slice(0, 2);
  const trending = filteredLocations.slice(0, 4);

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
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            <CategoryChips selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} />

            {/* Near you */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '6px 0 4px', marginBottom: '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px' }}>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0A0A0A' }}>
                  Near you
                </h2>
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#6B3FD1', background: 'rgba(127, 83, 243, 0.1)', padding: '3px 8px', borderRadius: '8px', display: 'inline-block' }}>
                  {'< 0.75 mi'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '0 16px', justifyContent: 'flex-start' }}>
                {nearYou.map((location) => (
                  <LocationCard key={location.id} location={location} layout="scroll" showDistance={true} flexGrow={false} />
                ))}
              </div>
            </div>

            {/* Popular */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '6px 0 4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px' }}>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0A0A0A' }}>
                  Popular
                </h2>
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#0A9B71', background: 'rgba(10, 155, 113, 0.1)', padding: '3px 8px', borderRadius: '8px', display: 'inline-block' }}>
                  {'< 2 mi'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '0 16px', justifyContent: 'flex-start' }}>
                {popular.map((location) => (
                  <LocationCard key={location.id} location={location} layout="scroll" showDistance={true} />
                ))}
              </div>
            </div>

            {/* Trending */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '6px 0 4px', marginBottom: '32px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0A0A0A', padding: '0 16px' }}>
                Trending in New York City
              </div>
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '0 16px' }}>
                {trending.map((location) => (
                  <LocationCard key={location.id} location={location} layout="scroll" />
                ))}
              </div>
            </div>

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
