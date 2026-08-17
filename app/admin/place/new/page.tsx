'use client';

import { useState, useEffect } from 'react';
import { categories } from '@/data/categories';

// Build color map from canonical categories
const categoryColorMap = categories.reduce((map, cat) => {
  map[cat.key] = cat.color;
  return map;
}, {} as Record<string, string>);

export default function NewPlacePage() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('landmark');
  const [address, setAddress] = useState('');
  const [about, setAbout] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [preview, setPreview] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [adminProfilePhoto, setAdminProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    const photo = localStorage.getItem('adminProfilePhoto');
    if (photo) {
      setAdminProfilePhoto(photo);
    }
  }, []);

  if (preview) {
    const catLabel = categories.find(c => c.key === category)?.label || 'Hidden Beach';
    const catColor = categoryColorMap[category] || '#6B3FD1';

    return (
      <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#000' }}>
        <div style={{ width: '100%', maxWidth: '375px', height: '100vh', background: '#000', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {/* Status Bar */}
          <div style={{ height: '44px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontSize: '12px', fontWeight: '600', color: '#fff', flexShrink: 0 }}>
            <span>9:41</span>
            <span>●●●●●●●●●</span>
          </div>

          {/* Full-Screen Image Area */}
          <div style={{ flex: 1, position: 'relative', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(10,10,10,0.4)', fontSize: '12px', overflow: 'hidden' }}>
            Hero Image

            {/* Top Gradient */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '130px', background: 'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0))', pointerEvents: 'none', zIndex: 2 }}></div>

            {/* Progress Segment Bars */}
            <div style={{ position: 'absolute', top: '60px', left: '14px', right: '14px', display: 'flex', gap: '5px', zIndex: 3 }}>
              {[1].map((i) => (
                <div key={i} style={{ flex: 1, height: '2px', background: '#fff', borderRadius: '1px', opacity: 1 }}></div>
              ))}
              {[2, 3, 4, 5, 6].map((i) => (
                <div key={i} style={{ flex: 1, height: '2px', background: '#fff', borderRadius: '1px', opacity: 0.5 }}></div>
              ))}
            </div>

            {/* Back Button */}
            <button onClick={() => setPreview(false)} style={{ position: 'absolute', top: '74px', left: '14px', width: '44px', height: '44px', borderRadius: '999px', background: 'rgba(0,0,0,0.35)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 3 }}>
              <svg width="9" height="15" viewBox="0 0 9 15" fill="none"><path d="M7.5 1.5l-6 6 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            {/* Distance Badge */}
            <div style={{ position: 'absolute', top: '118px', left: '14px', display: 'flex', alignItems: 'center', gap: '5px', background: 'linear-gradient(135deg,#95048B,#6B3FD1)', borderRadius: '999px', padding: '6px 12px', boxShadow: '0 3px 10px rgba(127,83,243,0.4)', zIndex: 3 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="#fff" strokeWidth="1.8"/><circle cx="12" cy="9.5" r="2.3" stroke="#fff" strokeWidth="1.8"/></svg>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>8.2 mi</span>
            </div>

            {/* Bottom Sheet - Absolutely Positioned */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#fff', borderRadius: '24px 24px 0 0', height: '52%', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -4px 20px rgba(0,0,0,0.15)', zIndex: 4 }}>
              {/* Sheet Handle & Chevron */}
              <button onClick={() => setSheetExpanded(!sheetExpanded)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '10px 0 4px', flexShrink: 0, width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ transform: sheetExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}><path d="M6 9l6 6 6-6" stroke="rgba(10,10,10,0.45)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>

              {/* Sheet Content - Scrollable */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Title Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <span style={{ alignSelf: 'flex-start', fontSize: '11px', fontWeight: '700', color: '#6B3FD1', background: 'rgba(127,83,243,0.1)', borderRadius: '999px', padding: '3px 10px' }}>{catLabel}</span>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: '#0A0A0A' }}>{title || 'Untitled place'}</span>
                  <span style={{ fontSize: '13.5px', color: 'rgba(10,10,10,0.6)' }}>{subtitle || 'No description provided'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', color: 'rgba(10,10,10,0.5)' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="#2E7FE8" strokeWidth="2"/><circle cx="12" cy="9.5" r="2.3" stroke="#2E7FE8" strokeWidth="2"/></svg>
                    {address || 'No address'}
                  </span>
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', background: '#E8F5E9', borderRadius: '14px', padding: '9px 6px', color: '#0A9B71' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="currentColor" strokeWidth="1.8"/><path d="M9 9.5l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{ fontSize: '14px', fontWeight: '800', lineHeight: '1' }}>0</span>
                    <span style={{ fontSize: '9.5px', fontWeight: '600', textTransform: 'uppercase', opacity: 0.75 }}>Visited</span>
                  </div>
                  <button style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', background: 'linear-gradient(135deg, rgba(149,4,139,0.1), rgba(127,83,243,0.1))', border: '1px solid rgba(149,4,139,0.25)', borderRadius: '14px', padding: '9px 6px', color: '#95048B', cursor: 'pointer' }}>
                    <span style={{ fontSize: '16px', lineHeight: '1' }}>★</span>
                    <span style={{ fontSize: '14px', fontWeight: '800', lineHeight: '1' }}>0</span>
                    <span style={{ fontSize: '9.5px', fontWeight: '600', textTransform: 'uppercase', opacity: 0.85 }}>Saved</span>
                  </button>
                  <button style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', background: 'linear-gradient(135deg, rgba(149,4,139,0.1), rgba(127,83,243,0.1))', border: '1px solid rgba(149,4,139,0.25)', borderRadius: '14px', padding: '9px 6px', color: '#95048B', cursor: 'pointer' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 22V11M2 13v7a2 2 0 002 2h12.5a2 2 0 002-1.6l1.5-7A2 2 0 0018 11h-5V6a2.5 2.5 0 00-5 0v1.5L5 11H4a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>
                    <span style={{ fontSize: '14px', fontWeight: '800', lineHeight: '1' }}>—%</span>
                    <span style={{ fontSize: '9.5px', fontWeight: '600', textTransform: 'uppercase', opacity: 0.85 }}>Worth it</span>
                  </button>
                </div>

                {/* Open in Maps Button */}
                <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#3EE8A8', color: '#0A0A0A', border: 'none', borderRadius: '14px', padding: '13px', fontSize: '14.5px', fontWeight: '700', cursor: 'pointer' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L4.5 20l7.5-4 7.5 4L12 2z" fill="#0A0A0A"/></svg>
                  Open in Maps
                </button>

                {/* Expanded Content */}
                {sheetExpanded && (
                  <>
                    {/* About */}
                    {about && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A0A0A' }}>About</div>
                        <div style={{ fontSize: '14px', color: 'rgba(10,10,10,0.75)', lineHeight: '1.55' }}>{about}</div>
                      </div>
                    )}

                    {/* Location Mini Map */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A0A0A' }}>Location</div>
                      <div style={{ position: 'relative', height: '130px', borderRadius: '14px', overflow: 'hidden', background: 'repeating-linear-gradient(0deg, rgba(10,10,10,0.035) 0 1px, transparent 1px 26px),repeating-linear-gradient(90deg, rgba(10,10,10,0.035) 0 1px, transparent 1px 26px), #eef0ea' }}>
                        <div style={{ position: 'absolute', left: '50%', top: '50%', width: '26px', height: '26px', borderRadius: '999px 999px 999px 0', background: '#6B3FD1', transform: 'translate(-50%,-100%) rotate(-45deg)', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }}></div>
                        <button style={{ position: 'absolute', bottom: '8px', right: '8px', background: '#fff', border: 'none', borderRadius: '999px', padding: '6px 12px', fontSize: '11px', fontWeight: '700', color: '#6B3FD1', boxShadow: '0 2px 6px rgba(0,0,0,0.12)', cursor: 'pointer' }}>Open in Maps</button>
                      </div>
                    </div>

                    {/* Creator */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A0A0A' }}>Place created by</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#E8D5F2', flexShrink: 0 }}></div>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#0A0A0A' }}>Brett Williams</span>
                      </div>
                    </div>

                    {/* Reviews */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A0A0A' }}>Reviews · 👍 Worth the trip · —% (0)</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Rate this place</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button style={{ flex: 1, background: '#fff', color: '#0A0A0A', border: '1px solid rgba(10,10,10,0.12)', borderRadius: '10px', padding: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>👍 Worth the trip</button>
                          <button style={{ flex: 1, background: '#fff', color: '#0A0A0A', border: '1px solid rgba(10,10,10,0.12)', borderRadius: '10px', padding: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>👎 Not worth it</button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#0A0A0A', flex: 1 }}>New Place</div>
          <button onClick={() => setPreview(!preview)} style={{ background: preview ? '#6B3FD1' : 'rgba(10,10,10,0.06)', border: 'none', borderRadius: '999px', padding: '8px 14px', fontSize: '12.5px', fontWeight: '700', color: preview ? '#fff' : '#0A0A0A', cursor: 'pointer' }}>◎ Preview</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Title</label>
            <input type="text" placeholder="Untitled place" value={title} onChange={(e) => setTitle(e.target.value.slice(0, 80))} style={{ border: '1px solid rgba(10,10,10,0.12)', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontFamily: 'inherit', color: '#0A0A0A' }} />
            <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.45)', textAlign: 'right' }}>{title.length}/80</div>
          </div>

          {/* SEO URL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: '600', color: '#6B3FD1', textTransform: 'uppercase' }}>SEO URL (generated from title)</label>
            <div style={{ fontSize: '12px', color: '#6B3FD1', wordBreak: 'break-all' }}>vibetravel.app/places/{title.toLowerCase().replace(/\s+/g, '-') || 'untitled-place'}</div>
          </div>

          {/* Subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Subtitle</label>
            <input type="text" placeholder="Describe this place" value={subtitle} onChange={(e) => setSubtitle(e.target.value.slice(0, 120))} style={{ border: '1px solid rgba(10,10,10,0.12)', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontFamily: 'inherit', color: '#0A0A0A' }} />
            <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.45)', textAlign: 'right' }}>{subtitle.length}/120</div>
          </div>

          {/* Category */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ border: '1px solid rgba(10,10,10,0.12)', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontFamily: 'inherit', color: '#0A0A0A' }}>
              {categories.sort((a, b) => a.label.localeCompare(b.label)).map(cat => (
                <option key={cat.key} value={cat.key}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Location</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ border: 'none', borderRadius: '999px', padding: '8px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', background: '#6B3FD1', color: '#fff' }}>Address</button>
              <button style={{ background: '#fff', color: '#0A0A0A', border: '1px solid rgba(10,10,10,0.12)', borderRadius: '999px', padding: '8px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>GPS Coordinates</button>
            </div>
            <input type="text" placeholder="Search Google Maps address…" value={address} onChange={(e) => setAddress(e.target.value)} style={{ border: '1px solid rgba(10,10,10,0.12)', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontFamily: 'inherit', color: '#0A0A0A' }} />
            <div style={{ position: 'relative', height: '110px', borderRadius: '10px', overflow: 'hidden', background: 'repeating-linear-gradient(0deg, rgba(10,10,10,0.035) 0 1px, transparent 1px 22px), repeating-linear-gradient(90deg, rgba(10,10,10,0.035) 0 1px, transparent 1px 22px), #eef0ea', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', width: '22px', height: '22px', borderRadius: '999px 999px 999px 0', background: '#6B3FD1', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }}></div>
              <span style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '9.5px', color: 'rgba(10,10,10,0.6)' }}>Google Maps · tap map to drop pin, drag to adjust</span>
            </div>
          </div>

          {/* About */}
          <div style={{ border: '1px solid rgba(10,10,10,0.1)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(10,10,10,0.45)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>About</span>
              <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.6)' }}>{about.length}/500</span>
            </div>
            <textarea value={about} onChange={(e) => setAbout(e.target.value.slice(0, 500))} style={{ border: '1px solid rgba(10,10,10,0.1)', borderRadius: '10px', padding: '10px 12px', fontSize: '13px', fontFamily: 'inherit', color: '#0A0A0A', minHeight: '80px', resize: 'none' }} placeholder="Tell us about this place…" />
          </div>

          {/* Creator Profile */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Creator Profile</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E8D5F2', flexShrink: 0, overflow: 'hidden' }}>
                {adminProfilePhoto && (
                  <img src={adminProfilePhoto} alt="Admin profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#6B3FD1' }}>Brett Williams</div>
            </div>
          </div>

          {/* Hero Image */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Hero (square tile format, 1:1, 1080 x 1080 px)</label>
              <button style={{ width: '16px', height: '16px', borderRadius: '999px', background: 'rgba(10,10,10,0.1)', border: 'none', color: 'rgba(10,10,10,0.6)', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>i</button>
            </div>
            <div style={{ width: '150px', height: '150px', borderRadius: '12px', background: '#f0f0f0', border: '2px dashed rgba(10,10,10,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(10,10,10,0.6)', fontSize: '12px', textAlign: 'center' }}>+ Upload</div>
          </div>

          {/* Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Gallery — photo or video, up to 6. Drag ⠿ to reorder</label>
              <button style={{ width: '16px', height: '16px', borderRadius: '999px', background: 'rgba(10,10,10,0.1)', border: 'none', color: 'rgba(10,10,10,0.6)', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>i</button>
            </div>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ position: 'relative', flexShrink: 0, width: '88px', height: '156px', borderRadius: '10px', background: '#f0f0f0', border: '2px dashed rgba(10,10,10,0.2)', cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(10,10,10,0.6)', fontSize: '11px' }}>+ Add</div>
              ))}
              <div style={{ position: 'relative', flexShrink: 0, width: '88px', height: '156px', borderRadius: '10px', background: '#f0f0f0', border: '2px dashed rgba(10,10,10,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(10,10,10,0.6)', fontSize: '11px' }}>+ 3 more</div>
            </div>
          </div>

          {/* YouTube URL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>YouTube URL (optional)</label>
            <input type="text" placeholder="https://youtube.com/watch?v=..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} style={{ border: '1px solid rgba(10,10,10,0.12)', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontFamily: 'inherit', color: '#0A0A0A' }} />
          </div>

          {/* Video Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Video links (Reels/TikToks/clips of this place on other platforms)</label>
            <button style={{ border: '2px dashed #6B3FD1', background: 'transparent', borderRadius: '10px', padding: '10px 12px', fontSize: '13px', fontWeight: '600', color: '#6B3FD1', cursor: 'pointer' }}>+ Add video link</button>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button style={{ flex: 1, background: 'rgba(127,83,243,0.1)', color: '#6B3FD1', border: '1px solid rgba(127,83,243,0.3)', borderRadius: '14px', padding: '12px', fontSize: '13.5px', fontWeight: '700', cursor: 'pointer' }}>Save Draft</button>
            <button style={{ flex: 1, background: 'none', color: '#0A0A0A', border: 'none', padding: '12px', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer' }}>Publish</button>
          </div>

          <button style={{ width: '100%', background: '#3EE8A8', color: '#0A0A0A', border: 'none', borderRadius: '14px', padding: '13px', fontSize: '14.5px', fontWeight: '700', cursor: 'pointer', marginTop: '12px' }}>Save Changes</button>

          {/* Danger Zone */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(10,10,10,0.08)' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(10,10,10,0.45)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Danger Zone</div>
            <button style={{ background: '#fff', color: '#0A0A0A', border: '1px solid rgba(10,10,10,0.12)', borderRadius: '12px', padding: '12px', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer' }}>Delete Place (soft)</button>
            <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.6)', textAlign: 'center' }}>Permanently delete...</div>
          </div>

          <div style={{ height: '20px' }}></div>
        </div>
      </div>
    </div>
  );
}
