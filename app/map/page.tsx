'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import MapView from '@/components/MapView';
import BottomNav from '@/components/BottomNav';

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleMarkerClick = (placeSlug: string) => {
    console.log('Marker clicked:', placeSlug);
  };

  return (
    <div style={{ background: '#F9F8F6', height: '100vh', display: 'flex', justifyContent: 'center' }}>
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
        <div style={{ position: 'relative', zIndex: 10, background: '#F2F2F7' }}>
          <div style={{ paddingTop: '32px', paddingLeft: '16px', paddingRight: '16px' }}>
            <Header />
          </div>
          <div style={{ padding: '12px 16px 16px' }}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', paddingBottom: '72px' }}>
          <MapView onMarkerClick={handleMarkerClick} />
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
