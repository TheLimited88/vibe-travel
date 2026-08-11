'use client';

import { useState } from 'react';
import { places } from '@/data/places';
import { categories } from '@/data/categories';
import MapView from '@/components/MapView';
import BottomNav from '@/components/BottomNav';

export default function AdminPlacesPage() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaces = places.filter(p => {
    const statusMatch = filterStatus === 'all' || p.status === filterStatus;
    const searchMatch = searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#fff' }}>
      <div style={{ width: '100%', maxWidth: '375px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Status Bar */}
        <div style={{ height: '44px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontSize: '12px', fontWeight: '600', borderBottom: '1px solid rgba(0,0,0,0.05)', flexShrink: 0 }}>
          <span>9:41</span>
          <span>●●●●●●●●●</span>
        </div>

        {/* Header */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.05)', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0A0A0A' }}>Places</div>
            <button style={{ background: '#3EE8A8', color: '#0A0A0A', border: 'none', borderRadius: '999px', padding: '9px 16px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}>+ New Place</button>
          </div>

          {/* Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '14px', padding: '10px 14px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="rgba(10,10,10,0.5)" strokeWidth="2" /><path d="M21 21l-4.3-4.3" stroke="rgba(10,10,10,0.5)" strokeWidth="2" strokeLinecap="round" /></svg>
            <input type="text" placeholder="Search Places" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px', background: 'transparent', fontFamily: 'inherit' }} />
          </div>

          {/* View Toggle */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => setViewMode('list')} style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '999px', padding: '6px 12px', fontSize: '12px', fontWeight: '600', border: `1px solid ${viewMode === 'list' ? '#7F53F3' : 'rgba(10,10,10,0.1)'}`, background: viewMode === 'list' ? '#7F53F3' : '#fff', color: viewMode === 'list' ? '#fff' : '#0A0A0A', cursor: 'pointer' }}>☰ List</button>
            <button onClick={() => setViewMode('map')} style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '999px', padding: '6px 12px', fontSize: '12px', fontWeight: '600', border: `1px solid ${viewMode === 'map' ? '#7F53F3' : 'rgba(10,10,10,0.1)'}`, background: viewMode === 'map' ? '#7F53F3' : '#fff', color: viewMode === 'map' ? '#fff' : '#0A0A0A', cursor: 'pointer' }}>⬥ Map</button>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['all', 'draft', 'published', 'archived'] as const).map((status) => (
              <button key={status} onClick={() => setFilterStatus(status)} style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '999px', padding: '6px 12px', fontSize: '12px', fontWeight: '600', border: `1px solid ${filterStatus === status ? '#7F53F3' : 'rgba(10,10,10,0.1)'}`, background: filterStatus === status ? '#7F53F3' : '#fff', color: filterStatus === status ? '#fff' : '#0A0A0A', cursor: 'pointer', textTransform: 'capitalize' }}>
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Map View */}
        {viewMode === 'map' && (
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', paddingBottom: '72px' }}>
            <MapView onMarkerClick={(slug) => console.log('Clicked:', slug)} />
          </div>
        )}

        {/* List View Placeholder */}
        {viewMode === 'list' && (
          <div style={{ flex: 1, overflow: 'y', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredPlaces.map((place) => {
              const category = categories.find(c => c.key === place.category);
              return (
                <div key={place.slug} style={{ background: '#f9f8f6', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '12px', padding: '12px', display: 'flex', gap: '12px' }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '10px', background: category?.color || '#7F53F3', opacity: place.status === 'draft' ? 0.65 : place.status === 'archived' ? 0.5 : 1 }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0A0A0A', marginBottom: '4px' }}>{place.title}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.6)', marginBottom: '8px' }}>{place.subtitle}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'rgba(10,10,10,0.5)' }}>
                      📍 {place.address}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: '700', padding: '4px 9px', borderRadius: '8px', background: place.status === 'published' ? 'rgba(10,155,113,0.12)' : 'rgba(10,10,10,0.07)', color: place.status === 'published' ? '#0A9B71' : 'rgba(10,10,10,0.5)' }}>
                        {place.status.charAt(0).toUpperCase() + place.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Nav */}
        <BottomNav />
      </div>
    </div>
  );
}
