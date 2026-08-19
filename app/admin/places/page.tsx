'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { categories } from '@/data/categories';
import type { PlaceRecord } from '@/lib/places';

function categoryBadgeStyle(color: string, icon: string): React.CSSProperties {
  const uri = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${icon}</svg>`)}`;
  return {
    display: 'inline-flex',
    flexShrink: 0,
    width: '16px',
    height: '16px',
    borderRadius: '999px',
    backgroundColor: color,
    backgroundImage: `url('${uri}')`,
    backgroundSize: '10px 10px',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };
}

export default function AdminPlacesPage() {
  const router = useRouter();
  const [places, setPlaces] = useState<PlaceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/places');
      const data = await res.json();
      if (data.success) {
        setPlaces(data.places);
      }
    } catch (error) {
      console.error('Failed to load places:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (slug: string) => {
    setDeletingSlug(slug);
    try {
      const res = await fetch(`/api/admin/places?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPlaces((prev) => prev.filter((p) => p.slug !== slug));
      }
    } catch (error) {
      console.error('Failed to delete place:', error);
    }
    setDeletingSlug(null);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#fff' }}>
      <div style={{ width: '100%', maxWidth: '375px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Status Bar */}
        <div style={{ height: '44px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontSize: '12px', fontWeight: '600', borderBottom: '1px solid rgba(0,0,0,0.05)', flexShrink: 0 }}>
          <span>9:41</span>
          <span>●●●●●●●●●</span>
        </div>

        {/* Header */}
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(0,0,0,0.07)', zIndex: 10 }}>
          <button style={{ width: '44px', height: '44px', borderRadius: '999px', background: '#fff', border: '1px solid rgba(10,10,10,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px', flexShrink: 0 }}>‹</button>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#0A0A0A', flex: 1 }}>Places</div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '24px 16px', gap: '20px' }}>
          {/* Heading */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0A0A0A' }}>My Places</div>
            {places.length > 0 && (
              <button onClick={() => router.push('/admin/place/new')} style={{ background: '#3EE8A8', color: '#0A0A0A', border: 'none', borderRadius: '999px', padding: '9px 16px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}>+ New Place</button>
            )}
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0', fontSize: '13px', color: 'rgba(10,10,10,0.5)' }}>Loading…</div>
          ) : places.length === 0 ? (
            /* Empty State */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', paddingTop: '40px' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ color: 'rgba(10,10,10,0.3)' }}>
                <path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#0A0A0A', textAlign: 'center' }}>No places yet</div>
              <div style={{ fontSize: '13px', color: 'rgba(10,10,10,0.6)', textAlign: 'center' }}>Create your first place to get started</div>
              <button onClick={() => router.push('/admin/place/new')} style={{ background: '#3EE8A8', color: '#0A0A0A', border: 'none', borderRadius: '14px', padding: '13px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '16px' }}>+ New Place</button>
            </div>
          ) : (
            /* Place Cards */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {places.map((place) => {
                const cat = categories.find((c) => c.key === place.category);
                return (
                  <div key={place.slug} style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#fff', borderRadius: '14px', padding: '10px', border: '1px solid rgba(10,10,10,0.06)' }}>
                    <button onClick={() => router.push(`/admin/place/${place.slug}`)} style={{ display: 'flex', gap: '12px', background: 'none', border: 'none', font: 'inherit', textAlign: 'left', padding: 0, margin: 0, cursor: 'pointer' }}>
                      <div style={{ width: '72px', height: '72px', borderRadius: '10px', flexShrink: 0, overflow: 'hidden', background: '#E8D5F2' }}>
                        {place.heroImage?.url && (
                          <img src={place.heroImage.url} alt={place.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#0A0A0A' }}>{place.title}</span>
                        {cat && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#6B3FD1' }}>
                            <span style={categoryBadgeStyle(cat.color, cat.icon)} />
                            {cat.label}
                          </span>
                        )}
                        {place.vibes.length > 0 && (
                          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {place.vibes.map((v) => (
                              <span key={v} style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(10,10,10,0.55)', background: 'rgba(10,10,10,0.05)', borderRadius: '999px', padding: '2px 8px', whiteSpace: 'nowrap' }}>{v}</span>
                            ))}
                          </div>
                        )}
                        {place.subtitle && (
                          <span style={{ fontSize: '12px', color: 'rgba(10,10,10,0.6)' }}>{place.subtitle}</span>
                        )}
                        {place.address && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: 'rgba(10,10,10,0.5)' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="#2E7FE8" strokeWidth="2"/><circle cx="12" cy="9.5" r="2.3" stroke="#2E7FE8" strokeWidth="2"/></svg>
                            {place.address}
                          </span>
                        )}
                      </div>
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      {place.status === 'published' ? (
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#0A9B71' }}>● Published</span>
                      ) : (
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#ED8A2C', background: 'rgba(237,138,44,0.15)', padding: '2px 8px', borderRadius: '8px' }}>◌ Draft</span>
                      )}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => router.push(`/admin/place/${place.slug}`)} aria-label="Edit place" style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(10,10,10,0.05)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l11-11-4-4L4 16v4z" stroke="#0A0A0A" strokeWidth="1.7" strokeLinejoin="round"/><path d="M14 6l4 4" stroke="#0A0A0A" strokeWidth="1.7"/></svg>
                        </button>
                        <button onClick={() => handleDelete(place.slug)} disabled={deletingSlug === place.slug} aria-label="Delete place" style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(220,50,50,0.08)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: deletingSlug === place.slug ? 'not-allowed' : 'pointer', opacity: deletingSlug === place.slug ? 0.5 : 1 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" stroke="#C23B3B" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Admin Bottom Navigation */}
        <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(10,10,10,0.07)', display: 'flex', padding: '8px 6px 24px', flexShrink: 0, gap: 0, justifyContent: 'space-around', zIndex: 30 }}>
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: '#6B3FD1', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="9.5" r="2.6" stroke="currentColor" strokeWidth="1.8"/></svg>
            <span>Places</span>
          </button>
          <button onClick={() => router.push('/admin/content')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l11-11-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.8"/></svg>
            <span>Content</span>
          </button>
          <button onClick={() => router.push('/admin/users')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.3" stroke="currentColor" strokeWidth="1.8"/><path d="M2.5 20c1.2-3.6 3.8-5.4 6.5-5.4s5.3 1.8 6.5 5.4" stroke="currentColor" strokeWidth="1.8"/><circle cx="17.5" cy="8.5" r="2.6" stroke="currentColor" strokeWidth="1.6"/><path d="M15.5 14.6c2.2.3 4 1.8 5 4.9" stroke="currentColor" strokeWidth="1.6"/></svg>
            <span>Users</span>
          </button>
          <button onClick={() => router.push('/admin/account')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8"/></svg>
            <span>Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
