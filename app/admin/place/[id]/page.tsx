'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const POPULAR_CATEGORIES = ['Hidden Beach', 'Scenic Lookout', 'Historic Building'];
const ALL_CATEGORIES = ['Waterfall', 'Street Art', 'Walking Trail', 'Market', 'Photo Spot', 'Quiet Place'];

export default function EditPlacePage() {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [title, setTitle] = useState('Dead Horse Bay');
  const [subtitle, setSubtitle] = useState('A sea-glass shoreline built on a century of buried trash');
  const [category, setCategory] = useState('Hidden Beach');
  const [locationMode, setLocationMode] = useState<'address' | 'coords'>('address');
  const [address, setAddress] = useState('Flatbush Ave & Aviation Rd, Brooklyn, NY');
  const [about, setAbout] = useState(
    'Most of the beaches in this city get crowded by 10am in July. This one never does — because it\'s technically a landfill cap that\'s been slowly crumbling into Jamaica Bay since the 1950s, and the tideline is a permanent glitter of sea glass, old bottles, and the occasional shoe sole.'
  );
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [heroInfoOpen, setHeroInfoOpen] = useState(false);
  const [galleryInfoOpen, setGalleryInfoOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previewExpanded, setPreviewExpanded] = useState(false);

  const seoUrl = `vibetravel.app/places/${title.toLowerCase().replace(/\s+/g, '-')}`;
  const aboutLength = about.length;

  const addressSuggestions = [
    'Flatbush Ave & Aviation Rd, Brooklyn, NY',
    'Flatbush Ave & Aviation Rd, Brooklyn, NY, New York, NY, USA',
    'Flatbush Ave & Aviation Rd, Brooklyn, NY St, Brooklyn, NY, USA',
    'Flatbush Ave & Aviation Rd, Brooklyn, NY Ave, Queens, NY, USA',
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#fff' }}>
      <div style={{ width: '100%', maxWidth: '375px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Header */}
        <div style={{ padding: '58px 16px 12px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <button
            onClick={() => router.back()}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '999px',
              background: '#fff',
              border: '1px solid rgba(10,10,10,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            aria-label="Back"
          >
            ‹
          </button>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#0A0A0A', flex: 1 }}>Edit Place</div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            style={{
              background: 'rgba(10,10,10,0.06)',
              border: 'none',
              borderRadius: '999px',
              padding: '8px 14px',
              fontSize: '12.5px',
              fontWeight: '700',
              color: '#0A0A0A',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ◎ Preview
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  border: '1px solid rgba(10,10,10,0.12)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  color: '#0A0A0A',
                }}
              />
              <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.45)', textAlign: 'right' }}>
                {title.length}/80
              </div>
            </div>

            {/* SEO URL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#7F53F3', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                SEO URL (generated from title)
              </label>
              <div style={{ fontSize: '12px', color: '#7F53F3', wordBreak: 'break-all' }}>{seoUrl}</div>
            </div>

            {/* Subtitle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Subtitle</label>
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                style={{
                  border: '1px solid rgba(10,10,10,0.12)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  color: '#0A0A0A',
                }}
              />
              <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.45)', textAlign: 'right' }}>
                {subtitle.length}/120
              </div>
            </div>

            {/* Category */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  border: '1px solid rgba(10,10,10,0.12)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  color: '#0A0A0A',
                  cursor: 'pointer',
                  background: '#fff',
                }}
              >
                <optgroup label="Popular">
                  {POPULAR_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="All categories">
                  {ALL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Location */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Location</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setLocationMode('address')}
                  style={{
                    background: locationMode === 'address' ? '#7F53F3' : '#fff',
                    color: locationMode === 'address' ? '#fff' : '#0A0A0A',
                    border: locationMode === 'address' ? 'none' : '1px solid rgba(10,10,10,0.12)',
                    borderRadius: '999px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Address
                </button>
                <button
                  onClick={() => setLocationMode('coords')}
                  style={{
                    background: locationMode === 'coords' ? '#7F53F3' : '#fff',
                    color: locationMode === 'coords' ? '#fff' : '#0A0A0A',
                    border: locationMode === 'coords' ? 'none' : '1px solid rgba(10,10,10,0.12)',
                    borderRadius: '999px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  GPS Coordinates
                </button>
              </div>

              {locationMode === 'address' && (
                <>
                  <input
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setShowAddressSuggestions(true);
                    }}
                    onFocus={() => setShowAddressSuggestions(true)}
                    style={{
                      border: '1px solid rgba(10,10,10,0.12)',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      paddingLeft: '34px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      color: '#0A0A0A',
                      position: 'relative',
                    }}
                    placeholder="Search Google Maps address…"
                  />

                  {showAddressSuggestions && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                      {addressSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setAddress(suggestion);
                            setShowAddressSuggestions(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: '#fff',
                            border: '1px solid rgba(10,10,10,0.1)',
                            borderTop: idx === 0 ? 'none' : '1px solid rgba(10,10,10,0.06)',
                            borderRadius: idx === 0 ? '10px 10px 0 0' : idx === addressSuggestions.length - 1 ? '0 0 10px 10px' : '0',
                            padding: '10px 12px',
                            fontSize: '13px',
                            color: '#0A0A0A',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                          }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                            <path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="rgba(10,10,10,0.4)" strokeWidth="1.6" />
                          </svg>
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {locationMode === 'coords' && (
                <>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input placeholder="Lat 40.6892" style={{ flex: 1, border: '1px solid rgba(10,10,10,0.12)', borderRadius: '10px', padding: '10px 12px', fontSize: '13px', fontFamily: 'inherit', color: '#0A0A0A' }} />
                    <input placeholder="Lng -74.0445" style={{ flex: 1, border: '1px solid rgba(10,10,10,0.12)', borderRadius: '10px', padding: '10px 12px', fontSize: '13px', fontFamily: 'inherit', color: '#0A0A0A' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.5)' }}>Use for places without a street address — parks, trailheads, remote lookouts.</div>
                </>
              )}

              {/* Map Preview */}
              <div style={{ position: 'relative', height: '110px', borderRadius: '10px', overflow: 'hidden', background: 'repeating-linear-gradient(0deg, rgba(10,10,10,0.035) 0 1px, transparent 1px 22px), repeating-linear-gradient(90deg, rgba(10,10,10,0.035) 0 1px, transparent 1px 22px), #eef0ea' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', width: '22px', height: '22px', borderRadius: '999px 999px 999px 0', background: '#7F53F3', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }} />
                <span style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '9.5px', color: 'rgba(10,10,10,0.6)' }}>Google Maps · tap map to drop pin, drag to adjust</span>
              </div>
            </div>

            {/* About */}
            <div style={{ border: '1px solid rgba(10,10,10,0.1)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(10,10,10,0.45)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>About</span>
                <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.6)' }}>{aboutLength}/500</span>
              </div>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                maxLength={500}
                rows={4}
                style={{
                  border: '1px solid rgba(10,10,10,0.1)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  color: '#0A0A0A',
                  resize: 'none',
                }}
              />
            </div>

            {/* Creator Profile */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Creator Profile</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#E8D5F2',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#7F53F3' }}>Brett Williams</span>
              </div>
            </div>

            {/* Hero Image */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', position: 'relative' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Hero (square tile format, 1:1, 1080 x 1080 px)</span>
                <button
                  onClick={() => setHeroInfoOpen(!heroInfoOpen)}
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '999px',
                    background: 'rgba(10,10,10,0.1)',
                    border: 'none',
                    color: 'rgba(10,10,10,0.6)',
                    fontSize: '10px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                    cursor: 'pointer',
                  }}
                >
                  i
                </button>
                {heroInfoOpen && (
                  <div style={{ position: 'absolute', top: '20px', left: '0', zIndex: 10, background: '#0A0A0A', color: '#fff', fontSize: '11px', lineHeight: '1.4', padding: '10px 12px', borderRadius: '10px', width: '220px', boxShadow: '0 6px 16px rgba(0,0,0,0.25)' }}>
                    Images are compressed automatically on upload. Accepts iOS and Android photo library formats (HEIC, JPEG, PNG, WebP). Portrait or square photos only — landscape uploads are rejected.
                  </div>
                )}
              </div>
              <div
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '12px',
                  background: '#E8D5F2',
                  border: '1px solid rgba(10,10,10,0.08)',
                }}
              />
            </div>

            {/* Gallery */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', position: 'relative' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Gallery — photo or video, up to 6. Drag ⠿ to reorder</span>
                <button
                  onClick={() => setGalleryInfoOpen(!galleryInfoOpen)}
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '999px',
                    background: 'rgba(10,10,10,0.1)',
                    border: 'none',
                    color: 'rgba(10,10,10,0.6)',
                    fontSize: '10px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  i
                </button>
                {galleryInfoOpen && (
                  <div style={{ position: 'absolute', top: '20px', left: '0', zIndex: 10, background: '#0A0A0A', color: '#fff', fontSize: '11px', lineHeight: '1.4', padding: '10px 12px', borderRadius: '10px', width: '200px', boxShadow: '0 6px 16px rgba(0,0,0,0.25)' }}>
                    Portrait format, 1080 x 1920 px.
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    draggable
                    style={{
                      position: 'relative',
                      flexShrink: 0,
                      width: '88px',
                      height: '156px',
                      borderRadius: '10px',
                      background: '#E8D5F2',
                      border: '1px solid rgba(10,10,10,0.08)',
                      cursor: 'grab',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* YouTube URL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>YouTube URL (optional)</label>
              <input
                placeholder="https://youtube.com/watch?v=..."
                style={{
                  border: '1px solid rgba(10,10,10,0.12)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  color: 'rgba(10,10,10,0.6)',
                }}
              />
            </div>

            {/* Video Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', textTransform: 'uppercase' }}>
                Video links (Reels/TikToks/clips of this place on other platforms)
              </label>
              <button
                style={{
                  border: '2px dashed #7F53F3',
                  background: 'transparent',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#7F53F3',
                  cursor: 'pointer',
                }}
              >
                + Add video link
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button
                style={{
                  flex: 1,
                  background: '#fff',
                  color: '#0A0A0A',
                  border: '1px solid rgba(10,10,10,0.12)',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Save Draft
              </button>
              <button
                style={{
                  flex: 1,
                  background: '#95048B',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Publish
              </button>
            </div>

            <button
              style={{
                width: '100%',
                background: '#3EE8A8',
                color: '#0A0A0A',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '13.5px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Save Changes
            </button>

            {/* Danger Zone */}
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(10,10,10,0.1)' }}>
              <div style={{ fontSize: '10.5px', fontWeight: '700', color: 'rgba(10,10,10,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                Danger Zone
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  width: '100%',
                  background: '#fff',
                  color: '#C23B3B',
                  border: '1px solid rgba(10,10,10,0.12)',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Delete Place (soft)
              </button>
              <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.6)', marginTop: '8px', textAlign: 'center' }}>
                Permanently delete...
              </div>
            </div>

            <div style={{ height: '40px' }} />
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      {showPreview && (
        <div style={{ position: 'fixed', inset: '0', background: '#000', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Image Gallery */}
          <div style={{ position: 'relative', flex: 1, background: '#000', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)' }} />

            {/* Progress Bars */}
            <div style={{ position: 'absolute', top: '60px', left: '14px', right: '14px', display: 'flex', gap: '5px', zIndex: 30 }}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ flex: 1, height: '2px', background: i <= currentImageIndex ? '#FFFFFF' : 'rgba(255,255,255,0.4)', borderRadius: '1px' }} />
              ))}
            </div>

            {/* Back Button */}
            <button onClick={() => setShowPreview(false)} style={{ position: 'absolute', top: '74px', left: '14px', width: '44px', height: '44px', borderRadius: '999px', background: 'rgba(0,0,0,0.35)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, cursor: 'pointer' }} aria-label="Back">
              <svg width="9" height="15" viewBox="0 0 9 15"><path d="M7.5 1.5l-6 6 6 6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>

            {/* Fullscreen & Share Buttons */}
            <button style={{ position: 'absolute', top: '74px', right: '56px', width: '44px', height: '44px', borderRadius: '999px', background: 'rgba(0,0,0,0.35)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, cursor: 'pointer' }} aria-label="Fullscreen">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M8 3H4a1 1 0 00-1 1v4M16 3h4a1 1 0 011 1v4M8 21H4a1 1 0 01-1-1v-4M16 21h4a1 1 0 001-1v-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button style={{ position: 'absolute', top: '74px', right: '14px', width: '44px', height: '44px', borderRadius: '999px', background: 'rgba(0,0,0,0.35)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, cursor: 'pointer' }} aria-label="Share">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="2.6" stroke="#fff" strokeWidth="1.6" /><circle cx="6" cy="12" r="2.6" stroke="#fff" strokeWidth="1.6" /><circle cx="18" cy="19" r="2.6" stroke="#fff" strokeWidth="1.6" /><path d="M8.3 10.7l7.4-4.2M8.3 13.3l7.4 4.2" stroke="#fff" strokeWidth="1.6" /></svg>
            </button>

            {/* Distance Badge */}
            <div style={{ position: 'absolute', top: '118px', left: '14px', display: 'flex', alignItems: 'center', gap: '5px', background: 'linear-gradient(135deg,#95048B,#7F53F3)', borderRadius: '999px', padding: '6px 12px', zIndex: 1, boxShadow: '0 3px 10px rgba(127,83,243,0.4)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="#fff" strokeWidth="1.8" /><circle cx="12" cy="9.5" r="2.3" stroke="#fff" strokeWidth="1.8" /></svg>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>0.6 mi</span>
            </div>

            {/* Navigation Areas */}
            <button onClick={() => setCurrentImageIndex((i) => (i > 0 ? i - 1 : 5))} style={{ position: 'absolute', top: '56px', bottom: '340px', left: '0', width: '35%', background: 'none', border: 'none', padding: '0', cursor: 'pointer', zIndex: 10 }} />
            <button onClick={() => setCurrentImageIndex((i) => (i < 5 ? i + 1 : 0))} style={{ position: 'absolute', top: '56px', bottom: '340px', right: '0', width: '65%', background: 'none', border: 'none', padding: '0', cursor: 'pointer', zIndex: 10 }} />
          </div>

          {/* Bottom Sheet */}
          <div style={{ background: '#fff', borderRadius: '24px 24px 0 0', boxShadow: '0 -8px 30px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', height: previewExpanded ? '86%' : '330px', overflowY: 'auto', transition: 'height 0.25s ease' }}>
            {/* Chevron */}
            <button onClick={() => setPreviewExpanded(!previewExpanded)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '10px 0 4px', flexShrink: 0, width: '100%', background: 'none', border: 'none', font: 'inherit', cursor: 'pointer' }} aria-label="Toggle details">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ transform: previewExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><path d="M6 9l6 6 6-6" stroke="rgba(10,10,10,0.45)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Category Badge */}
              <div style={{ display: 'inline-block', background: 'rgba(127,83,243,0.1)', color: '#7F53F3', padding: '3px 10px', borderRadius: '999px', fontSize: '10.5px', fontWeight: '700', alignSelf: 'flex-start' }}>
                {category}
              </div>

              {/* Title & Info */}
              <div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#0A0A0A', marginBottom: '6px' }}>{title}</div>
                <div style={{ fontSize: '13.5px', color: 'rgba(10,10,10,0.6)', marginBottom: '6px' }}>{subtitle}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'rgba(10,10,10,0.5)', marginBottom: '6px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="#2E7FE8" strokeWidth="2" /><circle cx="12" cy="9.5" r="2.3" stroke="#2E7FE8" strokeWidth="2" /></svg>
                  {address}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.6)' }}>Added 12 February 2026</div>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', background: 'rgba(62,232,168,0.15)', borderRadius: '14px', padding: '9px 6px', color: '#0A7A52' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="currentColor" strokeWidth="1.8" /><path d="M9 9.5l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span style={{ fontSize: '14px', fontWeight: '800', lineHeight: '1' }}>1893</span>
                  <span style={{ fontSize: '9.5px', fontWeight: '600', letterSpacing: '0.3px', textTransform: 'uppercase', opacity: 0.75 }}>Visited</span>
                </div>
                <button style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', background: '#7F53F3', border: 'none', borderRadius: '14px', padding: '9px 6px', color: '#fff', cursor: 'pointer' }}>
                  <span style={{ fontSize: '16px', lineHeight: '1' }}>⭐</span>
                  <span style={{ fontSize: '14px', fontWeight: '800', lineHeight: '1' }}>301</span>
                  <span style={{ fontSize: '9.5px', fontWeight: '600', letterSpacing: '0.3px', textTransform: 'uppercase', opacity: 0.85 }}>Saved</span>
                </button>
                <button style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', background: 'linear-gradient(135deg, rgba(149,4,139,0.1), rgba(127,83,243,0.1))', border: '1px solid rgba(149,4,139,0.25)', borderRadius: '14px', padding: '9px 6px', color: '#95048B', cursor: 'pointer' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 22V11M2 13v7a2 2 0 002 2h12.5a2 2 0 002-1.6l1.5-7A2 2 0 0018 11h-5V6a2.5 2.5 0 00-5 0v1.5L5 11H4a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>
                  <span style={{ fontSize: '14px', fontWeight: '800', lineHeight: '1' }}>100%</span>
                  <span style={{ fontSize: '9.5px', fontWeight: '600', letterSpacing: '0.3px', textTransform: 'uppercase', opacity: 0.85 }}>Worth it</span>
                </button>
              </div>

              {/* Open in Maps */}
              <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#3EE8A8', color: '#0A0A0A', border: 'none', borderRadius: '14px', padding: '13px', fontSize: '14.5px', fontWeight: '700', cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L4.5 20l7.5-4 7.5 4L12 2z" fill="#0A0A0A" /></svg>
                Open in Maps
              </button>

              {/* Expanded Content */}
              {previewExpanded && (
                <>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A0A0A', marginBottom: '6px' }}>About</div>
                    <div style={{ fontSize: '14px', color: 'rgba(10,10,10,0.75)', lineHeight: '1.55' }}>{about}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A0A0A', marginBottom: '8px' }}>Location</div>
                    <div style={{ position: 'relative', height: '150px', borderRadius: '14px', overflow: 'hidden', background: 'repeating-linear-gradient(0deg, rgba(10,10,10,0.035) 0 1px, transparent 1px 26px), repeating-linear-gradient(90deg, rgba(10,10,10,0.035) 0 1px, transparent 1px 26px), #eef0ea' }}>
                      <div style={{ position: 'absolute', left: '50%', top: '50%', width: '26px', height: '26px', borderRadius: '999px 999px 999px 0', background: '#7F53F3', transform: 'translate(-50%,-100%) rotate(-45deg)', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }} />
                      <button style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#fff', color: '#7F53F3', fontSize: '12px', fontWeight: '700', border: 'none', borderRadius: '999px', padding: '6px 12px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}>Open in Maps</button>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A0A0A', marginBottom: '8px' }}>Place created by</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#E8D5F2', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#0A0A0A' }}>Brett Williams</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: '0',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 50,
          }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              background: '#fff',
              borderRadius: '24px 24px 0 0',
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#0A0A0A', textAlign: 'center' }}>
              Delete this place?
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(10,10,10,0.6)', textAlign: 'center' }}>
              This action cannot be undone.
            </div>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                width: '100%',
                background: '#fff',
                color: '#0A0A0A',
                border: '1px solid rgba(10,10,10,0.12)',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '13.5px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              style={{
                width: '100%',
                background: '#C23B3B',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '13.5px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
