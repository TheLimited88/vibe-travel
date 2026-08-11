'use client';

import { useState } from 'react';

interface Place {
  slug: string;
  title: string;
  subtitle: string;
  address: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
}

const PLACES: Place[] = [
  { slug: 'dead-horse-bay', title: 'Dead Horse Bay', subtitle: 'A sea-glass shoreline built on a century of buried trash', address: 'Flatbush Ave & Aviation Rd, Brooklyn, NY', category: 'Hidden Beach', status: 'published' },
  { slug: 'brooklyn-heights-promenade', title: 'Brooklyn Heights Promenade', subtitle: 'The skyline view New Yorkers actually go to', address: 'Brooklyn Heights Promenade, Brooklyn, NY', category: 'Scenic Lookout', status: 'published' },
  { slug: 'merchants-house-museum', title: "Merchant's House Museum", subtitle: "A merchant family's home, untouched since 1835", address: '29 E 4th St, New York, NY', category: 'Historic Building', status: 'published' },
  { slug: 'the-ravine-cascades', title: 'The Ravine Cascades', subtitle: "Central Park's waterfall, hidden in plain sight", address: 'The Loch, Central Park, New York, NY', category: 'Waterfall', status: 'published' },
  { slug: 'bushwick-collective', title: 'The Bushwick Collective', subtitle: 'Open-air murals across a dozen industrial blocks', address: 'Troutman St & St Nicholas Ave, Brooklyn, NY', category: 'Street Art', status: 'published' },
  { slug: 'shore-road-promenade', title: 'Shore Road Promenade', subtitle: 'A Bay Ridge waterfront walk with zero tourists', address: 'Shore Rd, Bay Ridge, Brooklyn, NY', category: 'Walking Trail', status: 'draft' },
];

export default function AdminPlacesPage() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaces = (filterStatus === 'all' ? PLACES : PLACES.filter(p => p.status === filterStatus))
    .filter(p => searchQuery === '' || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) || p.address.toLowerCase().includes(searchQuery.toLowerCase()));

  const getStatusStyle = (status: string): React.CSSProperties => {
    if (status === 'published') {
      return {
        fontSize: '10.5px',
        fontWeight: '700',
        padding: '4px 9px',
        borderRadius: '8px',
        background: 'rgba(10,155,113,0.12)',
        color: '#0A9B71',
      };
    }
    return {
      fontSize: '10.5px',
      fontWeight: '700',
      padding: '4px 9px',
      borderRadius: '8px',
      background: 'rgba(10,10,10,0.07)',
      color: 'rgba(10,10,10,0.5)',
    };
  };

  const getRowOpacity = (status: string) => {
    if (status === 'draft') return 0.65;
    if (status === 'archived') return 0.5;
    return 1;
  };

  const chipStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
    borderRadius: '999px',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '600',
    border: `1px solid ${isActive ? '#7F53F3' : 'rgba(10,10,10,0.1)'}`,
    background: isActive ? '#7F53F3' : '#fff',
    color: isActive ? '#fff' : '#0A0A0A',
    cursor: 'pointer',
    font: 'inherit',
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#fff' }}>
      <div style={{ width: '100%', maxWidth: '375px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ padding: '58px 16px 24px 16px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0A0A0A' }}>Places</div>
            <button
              style={{
                background: '#3EE8A8',
                color: '#0A0A0A',
                border: 'none',
                borderRadius: '999px',
                padding: '9px 16px',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              + New Place
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '14px', padding: '10px 14px', width: '100%' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="rgba(10,10,10,0.5)" strokeWidth="2" />
              <path d="M21 21l-4.3-4.3" stroke="rgba(10,10,10,0.5)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Places"
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

          {/* View Mode Tabs */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                ...chipStyle(viewMode === 'list'),
              }}
            >
              ☰ List
            </button>
            <button
              onClick={() => setViewMode('map')}
              style={{
                ...chipStyle(viewMode === 'map'),
              }}
            >
              ⬥ Map
            </button>
          </div>

          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'All' },
              { key: 'draft', label: 'Draft' },
              { key: 'published', label: 'Published' },
              { key: 'archived', label: 'Archived' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key as any)}
                style={{
                  ...chipStyle(filterStatus === tab.key),
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Places List */}
          {viewMode === 'list' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredPlaces.map((place) => (
                <div
                  key={place.slug}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    background: '#fff',
                    borderRadius: '14px',
                    padding: '10px',
                    border: '1px solid rgba(10,10,10,0.06)',
                    opacity: getRowOpacity(place.status),
                  }}
                >
                  {/* Top Section: Image and Info */}
                  <button
                    style={{
                      display: 'flex',
                      gap: '12px',
                      background: 'none',
                      border: 'none',
                      font: 'inherit',
                      textAlign: 'left',
                      padding: 0,
                      margin: 0,
                      cursor: 'pointer',
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '10px',
                        background: '#E8D5F2',
                        flexShrink: 0,
                      }}
                    />

                    {/* Title, Subtitle, Address, Category */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0A0A0A' }}>
                        {place.title}
                      </span>
                      <span style={{ fontSize: '12px', color: 'rgba(10,10,10,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {place.subtitle}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: 'rgba(10,10,10,0.5)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                          <path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="#2E7FE8" strokeWidth="2" />
                          <circle cx="12" cy="9.5" r="2.3" stroke="#2E7FE8" strokeWidth="2" />
                        </svg>
                        {place.address}
                      </div>
                      <span style={{ fontSize: '11px', color: '#7F53F3' }}>
                        {place.category}
                      </span>
                    </div>
                  </button>

                  {/* Bottom Section: Status and Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={getStatusStyle(place.status)}>
                      {place.status === 'published' ? 'Published' : place.status === 'draft' ? 'Draft' : 'Archived'}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: 'rgba(10,10,10,0.05)',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          cursor: 'pointer',
                        }}
                        aria-label="Edit place"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M4 20h4l11-11-4-4L4 16v4z" stroke="#0A0A0A" strokeWidth="1.7" strokeLinejoin="round" />
                          <path d="M14 6l4 4" stroke="#0A0A0A" strokeWidth="1.7" />
                        </svg>
                      </button>

                      <button
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: 'rgba(220,50,50,0.08)',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          cursor: 'pointer',
                        }}
                        aria-label="Delete place"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" stroke="#C23B3B" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Map View */}
          {viewMode === 'map' && (
            <div
              style={{
                position: 'relative',
                height: '420px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'repeating-linear-gradient(0deg, rgba(10,10,10,0.035) 0 1px, transparent 1px 34px),repeating-linear-gradient(90deg, rgba(10,10,10,0.035) 0 1px, transparent 1px 34px), #eef0ea',
              }}
            />
          )}
        </div>

        {/* Bottom Navigation */}
        <div
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(10,10,10,0.07)',
            display: 'flex',
            padding: '8px 6px 24px',
            justifyContent: 'space-around',
            flexShrink: 0,
            gap: 0,
          }}
        >
          <button
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              fontSize: '9px',
              fontWeight: '600',
              color: '#7F53F3',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="currentColor" strokeWidth="1.8"/>
              <circle cx="12" cy="9.5" r="2.6" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
            <span>Places</span>
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              fontSize: '9px',
              fontWeight: '600',
              color: 'rgba(10,10,10,0.6)',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path d="M4 20h4l11-11-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
            <span>Content</span>
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              fontSize: '9px',
              fontWeight: '600',
              color: 'rgba(10,10,10,0.6)',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="8" r="3.3" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M2.5 20c1.2-3.6 3.8-5.4 6.5-5.4s5.3 1.8 6.5 5.4" stroke="currentColor" strokeWidth="1.8"/>
              <circle cx="17.5" cy="8.5" r="2.6" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M15.5 14.6c2.2.3 4 1.8 5 4.9" stroke="currentColor" strokeWidth="1.6"/>
            </svg>
            <span>Users</span>
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              fontSize: '9px',
              fontWeight: '600',
              color: 'rgba(10,10,10,0.6)',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
            <span>Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
