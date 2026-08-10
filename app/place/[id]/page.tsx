'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PlacePage() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div style={{ width: '100%', maxWidth: '375px', height: '812px', position: 'relative', background: '#000', margin: '0 auto', overflow: 'hidden' }}>
      {/* Full-bleed Media Gallery */}
      <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000', overflow: 'hidden' }}>
        {/* Segmented Progress Bars */}
        <div style={{ position: 'absolute', top: '60px', left: '14px', right: '14px', display: 'flex', gap: '5px', zIndex: 30 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
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
            right: '56px',
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
          top: '118px',
          left: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: 'linear-gradient(135deg,#95048B,#7F53F3)',
          borderRadius: '999px',
          padding: '6px 12px',
          zIndex: 1,
          boxShadow: '0 3px 10px rgba(127,83,243,0.4)',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="#fff" strokeWidth="1.8" />
            <circle cx="12" cy="9.5" r="2.3" stroke="#fff" strokeWidth="1.8" />
          </svg>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>0.6 mi</span>
        </div>

        {/* Navigation areas */}
        <button
          onClick={() => setCurrentImageIndex((i) => (i > 0 ? i - 1 : 5))}
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
          onClick={() => setCurrentImageIndex((i) => (i < 5 ? i + 1 : 0))}
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
          height: isExpanded ? '86%' : '330px',
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
          {/* Category Badge */}
          <div style={{ display: 'inline-block', background: 'rgba(127,83,243,0.1)', color: '#7F53F3', padding: '3px 8px', borderRadius: '8px', fontSize: '10.5px', fontWeight: '600', alignSelf: 'flex-start' }}>
            Photography Spot
          </div>

          {/* Title */}
          <button onClick={() => setIsExpanded(true)} style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', background: 'none', border: 'none', font: 'inherit', textAlign: 'left', padding: '0', margin: '0', cursor: 'pointer' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0A0A0A', lineHeight: '1.15' }}>
              Gantry Plaza State Park
            </div>
            <div style={{ fontSize: '13.5px', color: 'rgba(10,10,10,0.6)' }}>
              The best skyline photo you can take without a lens permit
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'rgba(10,10,10,0.6)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="rgba(10,10,10,0.5)" strokeWidth="1.8" />
                <circle cx="12" cy="9.5" r="2.3" stroke="rgba(10,10,10,0.5)" strokeWidth="1.8" />
              </svg>
              4-09 47th Rd, Long Island City, NY
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'rgba(10,10,10,0.6)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <rect x="3" y="5" width="18" height="16" rx="2" stroke="rgba(10,10,10,0.5)" strokeWidth="1.8" />
                <path d="M3 9h18M8 3v4M16 3v4" stroke="rgba(10,10,10,0.5)" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Added 22 April 2026
            </div>
          </button>

          {/* Stats Cards */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', background: 'rgba(62,232,168,0.15)', border: '1px solid rgba(62,232,168,0.25)', borderRadius: '14px', padding: '9px 6px', color: '#3EE8A8' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="currentColor" strokeWidth="1.8" />
                <path d="M9 9.5l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: '14px', fontWeight: '800', lineHeight: '1' }}>3800</span>
              <span style={{ fontSize: '9.5px', fontWeight: '600', letterSpacing: '0.3px', textTransform: 'uppercase', opacity: 0.75 }}>Visited</span>
            </div>
            <button style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', background: '#7F53F3', border: 'none', borderRadius: '14px', padding: '9px 6px', color: '#fff', cursor: 'pointer' }}>
              <span style={{ fontSize: '16px', lineHeight: '1' }}>⭐</span>
              <span style={{ fontSize: '14px', fontWeight: '800', lineHeight: '1' }}>711</span>
              <span style={{ fontSize: '9.5px', fontWeight: '600', letterSpacing: '0.3px', textTransform: 'uppercase', opacity: 0.85 }}>Saved</span>
            </button>
            <button style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', background: 'linear-gradient(135deg, rgba(149,4,139,0.1), rgba(127,83,243,0.1))', border: '1px solid rgba(149,4,139,0.25)', borderRadius: '14px', padding: '9px 6px', color: '#95048B', cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M7 22V11M2 13v7a2 2 0 002 2h12.5a2 2 0 002-1.6l1.5-7A2 2 0 0018 11h-5V6a2.5 2.5 0 00-5 0v1.5L5 11H4a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: '14px', fontWeight: '800', lineHeight: '1' }}>100%</span>
              <span style={{ fontSize: '9.5px', fontWeight: '600', letterSpacing: '0.3px', textTransform: 'uppercase', opacity: 0.85 }}>Worth it</span>
            </button>
          </div>

          {/* Open in Maps Button */}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#3EE8A8',
              color: '#0A0A0A',
              border: 'none',
              borderRadius: '14px',
              padding: '13px',
              fontSize: '14.5px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4.5 20l7.5-4 7.5 4L12 2z" fill="#0A0A0A" />
            </svg>
            Open in Maps
          </button>

          {/* Expanded Content */}
          {isExpanded && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A0A0A' }}>About</div>
                <div style={{ fontSize: '14px', color: 'rgba(10,10,10,0.75)', lineHeight: '1.55' }}>
                  Two restored 1920s gantry cranes frame a dead-straight shot of the Manhattan skyline across the East River, with Adirondack chairs planted right at the water's edge for the golden hour crowd. Arrive 45 minutes before sunset in summer to get a seat; arrive whenever in winter and have the place to yourself.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A0A0A' }}>Location</div>
                <div style={{ position: 'relative', height: '130px', borderRadius: '14px', overflow: 'hidden', background: 'repeating-linear-gradient(0deg, rgba(10,10,10,0.035) 0 1px, transparent 1px 26px),repeating-linear-gradient(90deg, rgba(10,10,10,0.035) 0 1px, transparent 1px 26px), #eef0ea' }}>
                  <div style={{ position: 'absolute', left: '50%', top: '40%', width: '26px', height: '26px', borderRadius: '999px 999px 999px 0', background: '#7F53F3', transform: 'translate(-50%,-100%) rotate(-45deg)', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }} />
                  <button style={{ position: 'absolute', bottom: '8px', right: '8px', background: '#fff', border: 'none', borderRadius: '999px', padding: '6px 12px', fontSize: '11px', fontWeight: '700', color: '#7F53F3', boxShadow: '0 2px 6px rgba(0,0,0,0.12)', cursor: 'pointer' }}>
                    Open in Maps
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A0A0A' }}>Place created by</div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', background: 'none', border: 'none', font: 'inherit', textAlign: 'left', padding: '0', margin: '0', cursor: 'pointer' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '999px', background: '#E0E0E0', flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#0A0A0A' }}>Brett Williams</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A0A0A' }}>Reviews · 👍 Worth the trip · 100% (4)</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Rate this place</span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{ flex: 1, background: '#FFF4E6', border: 'none', borderRadius: '14px', padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#0A0A0A' }}>
                      👍 Worth the trip
                    </button>
                    <button style={{ flex: 1, background: '#F0F0F0', border: 'none', borderRadius: '14px', padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: 'rgba(0,0,0,0.6)' }}>
                      👎 Not worth it
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '11.5px', color: 'rgba(10,10,10,0.6)', lineHeight: '1.4' }}>
                  All reviews are by people who have actually been there. You can only review once you trip the geofence around the Place.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
