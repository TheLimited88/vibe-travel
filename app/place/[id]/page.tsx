'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { categories } from '@/data/categories';
import PlaceDirections from '@/components/PlaceDirections';
import PlaceLocationMap from '@/components/PlaceLocationMap';

interface PlaceMedia {
  url: string;
  key: string;
}

interface PlaceData {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  vibes: string[];
  address: string;
  lat: number | null;
  lng: number | null;
  about: string;
  heroImage: PlaceMedia | null;
  galleryImages: PlaceMedia[];
  createdBy: string;
  createdAt: number;
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov|webm)$/i.test(url);
}

export default function PlacePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.id as string;

  const [place, setPlace] = useState<PlaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [vibeVoteExpanded, setVibeVoteExpanded] = useState(false);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [placeVerdict, setPlaceVerdict] = useState<'up' | 'down' | null>(null);
  const [adminPhotoUrl, setAdminPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/admin/places?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => setPlace(data.place || null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    fetch('/api/admin/profile')
      .then((r) => r.json())
      .then((data) => setAdminPhotoUrl(data.photoUrl || null))
      .catch(() => setAdminPhotoUrl(null));
  }, []);

  const category = categories.find((c) => c.key === place?.category) || categories[0];
  const media = place ? [place.heroImage, ...place.galleryImages].filter((m): m is PlaceMedia => !!m) : [];

  const vibeOptions = [
    'Peaceful',
    'Adventurous',
    'Romantic',
    'Scenic',
    'Hidden Gem',
    'Instagram-worthy',
    'Family-friendly',
    'Sunset Spot',
    'Photography',
    'Nature',
    'Urban',
    'Quirky',
  ];

  const topVibes = [
    { tag: 'Great Views', count: 130, color: '#FFE5E5', textColor: '#E85D75' },
    { tag: 'Photo Worthy', count: 105, color: '#E5F0FF', textColor: '#4B9AFF' },
    { tag: 'Sunset', count: 88, color: '#FFF5E5', textColor: '#F5A623' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#F9F8F6' }}>
        <div style={{ width: '100%', maxWidth: '375px', height: '812px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
          <span style={{ fontSize: '14px', color: 'rgba(10,10,10,0.5)' }}>Loading...</span>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#F9F8F6' }}>
        <div style={{ width: '100%', maxWidth: '375px', height: '812px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#fff', padding: '20px' }}>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#0A0A0A' }}>Place not found</span>
          <button
            onClick={() => router.push('/')}
            style={{ background: '#3EE8A8', color: '#0A0A0A', border: 'none', borderRadius: '14px', padding: '11px 20px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#F9F8F6' }}>
    <div style={{ width: '100%', maxWidth: '375px', height: '812px', position: 'relative', background: '#000', overflow: 'hidden' }}>
      {/* Full-bleed Media Gallery */}
      <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000', overflow: 'hidden' }}>
        {/* Segmented Progress Bars */}
        <div style={{ position: 'absolute', top: '60px', left: '14px', right: '14px', display: 'flex', gap: '5px', zIndex: 30 }}>
          {media.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: '2px',
                background: i <= currentImageIndex ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                borderRadius: '1px',
                transition: 'background 0.2s',
              }}
            />
          ))}
        </div>

        {/* Current media */}
        {media.length > 0 && (
          isVideoUrl(media[currentImageIndex].url) ? (
            <video
              key={media[currentImageIndex].url}
              src={media[currentImageIndex].url}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              key={media[currentImageIndex].url}
              src={media[currentImageIndex].url}
              alt={place.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )
        )}

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          aria-label="Back"
          style={{
            position: 'absolute',
            top: '74px',
            left: '14px',
            width: '44px',
            height: '44px',
            borderRadius: '999px',
            background: 'rgba(0,0,0,0.35)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            cursor: 'pointer',
          }}
        >
          <svg width="9" height="15" viewBox="0 0 9 15">
            <path d="M7.5 1.5l-6 6 6 6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Fullscreen Button */}
        <button
          aria-label="View fullscreen"
          style={{
            position: 'absolute',
            top: '74px',
            right: '66px',
            width: '44px',
            height: '44px',
            borderRadius: '999px',
            background: 'rgba(0,0,0,0.35)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            cursor: 'pointer',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M8 3H4a1 1 0 00-1 1v4M16 3h4a1 1 0 011 1v4M8 21H4a1 1 0 01-1-1v-4M16 21h4a1 1 0 001-1v-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Share Button */}
        <button
          aria-label="Share"
          style={{
            position: 'absolute',
            top: '74px',
            right: '14px',
            width: '44px',
            height: '44px',
            borderRadius: '999px',
            background: 'rgba(0,0,0,0.35)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            cursor: 'pointer',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="18" cy="5" r="2.6" stroke="#fff" strokeWidth="1.6" />
            <circle cx="6" cy="12" r="2.6" stroke="#fff" strokeWidth="1.6" />
            <circle cx="18" cy="19" r="2.6" stroke="#fff" strokeWidth="1.6" />
            <path d="M8.3 10.7l7.4-4.2M8.3 13.3l7.4 4.2" stroke="#fff" strokeWidth="1.6" />
          </svg>
        </button>

        {/* Distance Badge */}
        <div style={{
          position: 'absolute',
          top: '132px',
          left: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: 'linear-gradient(135deg,#95048B,#6B3FD1)',
          borderRadius: '999px',
          padding: '6px 12px',
          zIndex: 1,
          boxShadow: '0 3px 10px rgba(127,83,243,0.4)',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="#fff" strokeWidth="1.8" />
            <circle cx="12" cy="9.5" r="2.3" stroke="#fff" strokeWidth="1.8" />
          </svg>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>4.2 mi</span>
        </div>

        {/* Navigation areas */}
        <button
          onClick={() => setCurrentImageIndex((i) => (i > 0 ? i - 1 : media.length - 1))}
          aria-label="Previous photo"
          style={{
            position: 'absolute',
            top: '56px',
            bottom: '340px',
            left: '0',
            width: '35%',
            background: 'none',
            border: 'none',
            padding: '0',
            cursor: 'pointer',
            zIndex: 10,
          }}
        />
        <button
          onClick={() => setCurrentImageIndex((i) => (i < media.length - 1 ? i + 1 : 0))}
          aria-label="Next photo"
          style={{
            position: 'absolute',
            top: '56px',
            bottom: '340px',
            right: '0',
            width: '65%',
            background: 'none',
            border: 'none',
            padding: '0',
            cursor: 'pointer',
            zIndex: 10,
          }}
        />
      </div>

      {/* Bottom Sheet Card */}
      <div
        style={{
          position: 'absolute',
          left: '0',
          right: '0',
          bottom: '0',
          zIndex: 2,
          background: '#fff',
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -8px 30px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'height 0.25s ease',
          overflow: 'hidden',
          height: isExpanded ? '86%' : 'auto',
          maxHeight: '86%',
        }}
      >
        {/* Chevron Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle details"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            padding: '10px 0 4px',
            flexShrink: 0,
            width: '100%',
            background: 'none',
            border: 'none',
            font: 'inherit',
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            style={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            <path d="M6 9l6 6 6-6" stroke="rgba(10,10,10,0.45)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <button onClick={() => setIsExpanded(true)} style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%', background: 'none', border: 'none', font: 'inherit', textAlign: 'left', padding: '0', margin: '0', cursor: 'pointer', minWidth: 0 }}>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#0A0A0A' }}>{place.title}</span>
            <span style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: '#6B3FD1', background: 'rgba(127,83,243,0.1)', borderRadius: '999px', padding: '3px 10px 3px 4px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ color: '#6B3FD1' }}>
                <g dangerouslySetInnerHTML={{ __html: category.icon }} />
              </svg>
              {category.label}
            </span>
            {place.vibes.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {place.vibes.map((vibe) => (
                  <span key={vibe} style={{ fontSize: '11px', fontWeight: '600', color: '#0A9B71', background: 'rgba(10,155,113,0.1)', borderRadius: '999px', padding: '3px 10px' }}>
                    {vibe}
                  </span>
                ))}
              </div>
            )}
            <span style={{ fontSize: '13.5px', color: 'rgba(10,10,10,0.6)' }}>
              {place.subtitle}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', color: 'rgba(10,10,10,0.5)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="#2E7FE8" strokeWidth="2" />
                <circle cx="12" cy="9.5" r="2.3" stroke="#2E7FE8" strokeWidth="2" />
              </svg>
              {place.address}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'rgba(10,10,10,0.5)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <rect x="3" y="4" width="18" height="17" rx="2" stroke="rgba(10,10,10,0.5)" strokeWidth="1.8" />
                <path d="M3 9h18M8 2v4M16 2v4" stroke="rgba(10,10,10,0.5)" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Added {new Date(place.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </button>

          {/* Stats Cards */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', background: 'rgba(62,232,168,0.15)', border: '1px solid rgba(62,232,168,0.25)', borderRadius: '14px', padding: '9px 6px', color: '#3EE8A8' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="currentColor" strokeWidth="1.8" />
                <path d="M9 9.5l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: '14px', fontWeight: '800', lineHeight: '1' }}>0</span>
              <span style={{ fontSize: '9.5px', fontWeight: '600', letterSpacing: '0.3px', textTransform: 'uppercase', opacity: 0.75 }}>Visited</span>
            </div>
            <button style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', background: '#6B3FD1', border: 'none', borderRadius: '14px', padding: '9px 6px', color: '#fff', cursor: 'pointer' }}>
              <span style={{ fontSize: '16px', lineHeight: '1' }}>★</span>
              <span style={{ fontSize: '14px', fontWeight: '800', lineHeight: '1' }}>0</span>
              <span style={{ fontSize: '9.5px', fontWeight: '600', letterSpacing: '0.3px', textTransform: 'uppercase', opacity: 0.85 }}>Saved</span>
            </button>
            <button style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', background: 'linear-gradient(135deg, rgba(149,4,139,0.1), rgba(127,83,243,0.1))', border: '1px solid rgba(149,4,139,0.25)', borderRadius: '14px', padding: '9px 6px', color: '#95048B', cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M7 22V11M2 13v7a2 2 0 002 2h12.5a2 2 0 002-1.6l1.5-7A2 2 0 0018 11h-5V6a2.5 2.5 0 00-5 0v1.5L5 11H4a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: '14px', fontWeight: '800', lineHeight: '1' }}>—</span>
              <span style={{ fontSize: '9.5px', fontWeight: '600', letterSpacing: '0.3px', textTransform: 'uppercase', opacity: 0.85 }}>Worth it</span>
            </button>
          </div>

          {/* Geofence Directions Component */}
          <PlaceDirections
            place={{
              id: place.slug,
              name: place.title,
              lat: place.lat ?? 0,
              lng: place.lng ?? 0,
              address: place.address,
            }}
          />

          {/* Expanded Content */}
          {isExpanded && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A0A0A' }}>About</div>
                <div style={{ fontSize: '14px', color: 'rgba(10,10,10,0.75)', lineHeight: '1.55' }}>
                  {place.about}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A0A0A' }}>Location</div>
                <div style={{ position: 'relative', height: '200px', borderRadius: '14px', overflow: 'hidden' }}>
                  {place.lat != null && place.lng != null ? (
                    <PlaceLocationMap lat={place.lat} lng={place.lng} markerColor={category.color} markerIcon={category.icon} />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, background: '#eef0ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'rgba(10,10,10,0.4)' }}>
                      No coordinates set for this place
                    </div>
                  )}
                  <a
                    href={`https://maps.apple.com/?daddr=${place.lat},${place.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ position: 'absolute', top: '8px', left: '8px', background: '#fff', border: 'none', borderRadius: '999px', padding: '6px 12px', fontSize: '11px', fontWeight: '700', color: '#6B3FD1', boxShadow: '0 2px 6px rgba(0,0,0,0.12)', cursor: 'pointer', textDecoration: 'none', zIndex: 20 }}
                  >
                    Open in Maps
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A0A0A' }}>Place created by</div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', background: 'none', border: 'none', font: 'inherit', textAlign: 'left', padding: '0', margin: '0', cursor: 'pointer' }}>
                  {adminPhotoUrl ? (
                    <img
                      src={adminPhotoUrl}
                      alt={place.createdBy}
                      style={{ width: '52px', height: '52px', borderRadius: '999px', objectFit: 'cover', flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{ width: '52px', height: '52px', borderRadius: '999px', background: '#E0E0E0', flexShrink: 0 }} />
                  )}
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#0A0A0A' }}>{place.createdBy}</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A0A0A' }}>Reviews (0) · 👍 · 0% &apos;Worth it&apos;</div>
                  <div style={{ fontSize: '12.5px', color: 'rgba(10,10,10,0.65)' }}>👍 Worth the trip (0) · 👎 Not worth it (0)</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#0A0A0A' }}>Vibe</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {topVibes.map((vibe) => (
                      <span key={vibe.tag} style={{ fontSize: '11px', fontWeight: '600', color: vibe.textColor, background: vibe.color, borderRadius: '999px', padding: '3px 10px' }}>
                        {vibe.tag} ({vibe.count})
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Rate this Place</span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setPlaceVerdict(placeVerdict === 'up' ? null : 'up')}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        borderRadius: '14px',
                        padding: '11px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        border: `1px solid ${placeVerdict === 'up' ? '#7F53F3' : 'rgba(10,10,10,0.08)'}`,
                        background: placeVerdict === 'up' ? 'rgba(127,83,243,0.1)' : '#fff',
                        color: placeVerdict === 'up' ? '#7F53F3' : '#0A0A0A',
                      }}
                    >
                      👍 Worth the trip
                    </button>
                    <button
                      onClick={() => setPlaceVerdict(placeVerdict === 'down' ? null : 'down')}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        borderRadius: '14px',
                        padding: '11px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        border: `1px solid ${placeVerdict === 'down' ? '#7F53F3' : 'rgba(10,10,10,0.08)'}`,
                        background: placeVerdict === 'down' ? 'rgba(127,83,243,0.1)' : '#fff',
                        color: placeVerdict === 'down' ? '#7F53F3' : '#0A0A0A',
                      }}
                    >
                      👎 Not worth it
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => setVibeVoteExpanded(!vibeVoteExpanded)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      width: 'calc(50% - 5px)',
                      background: '#fff',
                      border: '1px solid rgba(10,10,10,0.15)',
                      borderRadius: '14px',
                      padding: '11px',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#0A0A0A',
                      cursor: 'pointer',
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <rect x="4" y="13" width="3.5" height="8" rx="1.5" fill="#A10EBC" transform="rotate(-12 5.75 17)" />
                      <rect x="10.2" y="8" width="3.5" height="13" rx="1.5" fill="#A10EBC" transform="rotate(-12 12 14.5)" />
                      <rect x="16.4" y="10.5" width="3.5" height="10.5" rx="1.5" fill="#A10EBC" transform="rotate(-12 18.15 15.75)" />
                    </svg>
                    <span>Rate the Vibe</span>
                  </button>
                  {vibeVoteExpanded && (
                    <>
                      <div style={{ fontSize: '11.5px', color: 'rgba(10,10,10,0.6)', lineHeight: '1.4', textAlign: 'center' }}>
                        Select up to 2 Vibe Tags
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px' }}>
                        {vibeOptions.map((vibe) => (
                          <button
                            key={vibe}
                            onClick={() => {
                              if (selectedVibes.includes(vibe)) {
                                setSelectedVibes(selectedVibes.filter((v) => v !== vibe));
                              } else if (selectedVibes.length < 2) {
                                setSelectedVibes([...selectedVibes, vibe]);
                              }
                            }}
                            disabled={selectedVibes.length >= 2 && !selectedVibes.includes(vibe)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '999px',
                              border: '1px solid rgba(10,10,10,0.15)',
                              background: selectedVibes.includes(vibe) ? '#A10EBC' : '#F5F5F5',
                              color: selectedVibes.includes(vibe) ? '#fff' : '#0A0A0A',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: selectedVibes.length >= 2 && !selectedVibes.includes(vibe) ? 'not-allowed' : 'pointer',
                              opacity: selectedVibes.length >= 2 && !selectedVibes.includes(vibe) ? 0.5 : 1,
                            }}
                          >
                            {vibe}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', borderTop: '1px solid rgba(10,10,10,0.07)', paddingTop: '10px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l2.2 1.6 2.7-.4 1 2.5 2.5 1-.4 2.7L21.6 12l-1.6 2.2.4 2.7-2.5 1-1 2.5-2.7-.4L12 22l-2.2-1.6-2.7.4-1-2.5-2.5-1 .4-2.7L2.4 12l1.6-2.2-.4-2.7 2.5-1 1-2.5 2.7.4L12 2z" fill="#0A96FF" />
                    <path d="M8.5 12.2l2.4 2.4 4.6-4.6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div style={{ fontSize: '11.5px', color: 'rgba(10,10,10,0.6)', lineHeight: '1.4', textAlign: 'center' }}>
                    All reviews come from people who've actually been there and triggered the geofence. Create an account to start exploring, share your experiences, and help others discover great places.
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
