'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import CategoryChips from '@/components/CategoryChips';
import LocationCard from '@/components/LocationCard';
import BottomNav from '@/components/BottomNav';
import BeforeExploreModal from '@/components/BeforeExploreModal';
import TermsPoliciesModal from '@/components/TermsPoliciesModal';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
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
    <div style={{ background: '#F9F8F6', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
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
          minHeight: '100vh',
          background: '#F2F2F7',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ background: '#F4F2F8', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', paddingBottom: '72px', paddingTop: '32px' }}>
          <Header />

          <main style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
            <div style={{ paddingTop: '12px' }}>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            <CategoryChips selectedCategory={selectedCategory === 'All' ? 'all' : selectedCategory} onSelectCategory={handleSelectCategory} />

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
