'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import CategoryChips from '@/components/CategoryChips';
import LocationCard from '@/components/LocationCard';
import BottomNav from '@/components/BottomNav';
import BeforeExploreModal from '@/components/BeforeExploreModal';
import { mockLocations } from '@/data/mockLocations';
import type { LocationCategory } from '@/types';

type Category = 'All' | LocationCategory;

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectCategory = (categoryId: string) => {
    const category = categoryId === 'all' ? 'All' : (categoryId as Category);
    setSelectedCategory(category);
  };

  const filteredLocations = mockLocations.filter((location) => {
    const matchesCategory = selectedCategory === 'All' || location.category === selectedCategory;
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedByDistance = [...filteredLocations].sort((a, b) => a.distance - b.distance);
  const sortedByPopularity = [...filteredLocations].sort((a, b) => b.visits - a.visits);

  const nearYou = sortedByDistance.slice(0, 1);
  const popular = sortedByPopularity.slice(0, 2);
  const trending = sortedByPopularity.slice(0, 3);

  return (
    <div style={{ background: '#F9F8F6', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BeforeExploreModal />
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
          maxWidth: '100vw',
          minHeight: '100vh',
          background: '#F2F2F7',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ background: '#F4F2F8', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingBottom: '72px', paddingTop: '32px' }}>
          <Header />

          <main style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
            <div style={{ paddingTop: '12px' }}>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            <CategoryChips selectedCategory={selectedCategory === 'All' ? 'all' : selectedCategory} onSelectCategory={handleSelectCategory} />

            {/* Near you */}
            <div style={{ marginTop: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h2 style={{ margin: 0, fontSize: '15.3px', fontWeight: 700, color: '#0A0A0A', fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                  Near you
                </h2>
                <span style={{ fontSize: '9.7px', fontWeight: 700, color: '#7F53F3', fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif", background: 'rgba(127, 83, 243, 0.1)', padding: '4px 8px', borderRadius: '8px', display: 'inline-block' }}>
                  {'< 0.75 mi'}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', maxWidth: '180px' }}>
                {nearYou.map((location) => (
                  <LocationCard key={location.id} location={location} layout="grid" showDistance={true} />
                ))}
              </div>
            </div>

            {/* Popular */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h2 style={{ margin: 0, fontSize: '15.3px', fontWeight: 700, color: '#0A0A0A', fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                  Popular
                </h2>
                <span style={{ fontSize: '9.8px', fontWeight: 700, color: 'var(--color-distance-text)', fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif", background: 'var(--color-distance-bg)', padding: '4px 8px', borderRadius: '8px', display: 'inline-block' }}>
                  {'< 2 mi'}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {popular.map((location) => (
                  <LocationCard key={location.id} location={location} layout="grid" showDistance={true} />
                ))}
              </div>
            </div>

            {/* Trending */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h2 style={{ margin: 0, fontSize: '15.1px', fontWeight: 700, color: '#0A0A0A', fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                  Trending in New York City
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '32px' }}>
                {trending.map((location) => (
                  <LocationCard key={location.id} location={location} layout="grid" />
                ))}
              </div>
            </div>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid rgba(10, 10, 10, 0.08)', paddingTop: '24px', marginTop: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px', fontSize: '11px', color: 'rgba(10, 10, 10, 0.5)', fontWeight: 500 }}>
                <a href="#" style={{ color: 'rgba(10, 10, 10, 0.5)', textDecoration: 'none' }}>About</a>
                <a href="#" style={{ color: 'rgba(10, 10, 10, 0.5)', textDecoration: 'none' }}>Help</a>
                <a href="#" style={{ color: 'rgba(10, 10, 10, 0.5)', textDecoration: 'none' }}>Terms of Service</a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px', fontSize: '11px', color: 'rgba(10, 10, 10, 0.5)', fontWeight: 500 }}>
                <a href="#" style={{ color: 'rgba(10, 10, 10, 0.5)', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="#" style={{ color: 'rgba(10, 10, 10, 0.5)', textDecoration: 'none' }}>Acceptable Use</a>
                <a href="#" style={{ color: 'rgba(10, 10, 10, 0.5)', textDecoration: 'none' }}>Cookie Policy</a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '11px', color: 'rgba(10, 10, 10, 0.5)', fontWeight: 500 }}>
                <span>Location: Off</span>
                <span>Notifications: Off</span>
                <a href="#" style={{ color: 'rgba(10, 10, 10, 0.5)', textDecoration: 'none' }}>Accessibility</a>
              </div>
            </footer>
          </main>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
