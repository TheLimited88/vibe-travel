'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CATEGORIES = [
  'Hidden Beach',
  'Scenic Lookout',
  'Historic Building',
  'Waterfall',
  'Street Art',
  'Walking Trail',
];

export default function EditPlacePage() {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [title, setTitle] = useState('Dead Horse Bay');
  const [subtitle, setSubtitle] = useState('A sea-glass shoreline built on a century of buried trash');
  const [category, setCategory] = useState('Hidden Beach');
  const [address, setAddress] = useState('Flatbush Ave & Aviation Rd, Brooklyn, NY');
  const [about, setAbout] = useState(
    'Most of the beaches in this city get crowded by 10am in July. This one never does — because it\'s technically a landfill cap that\'s been slowly crumbling into Jamaica Bay since the 1950s, and the tideline is a permanent glitter of sea glass, old bottles, and the occasional shoe sole.'
  );
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const seoUrl = `vibetravel.app/places/${title.toLowerCase().replace(/\s+/g, '-')}`;

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
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Category</label>
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
                }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Location</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={{
                    background: '#7F53F3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  📍 Address
                </button>
                <button
                  style={{
                    background: '#fff',
                    color: '#0A0A0A',
                    border: '1px solid rgba(10,10,10,0.12)',
                    borderRadius: '999px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  🧭 GPS Coordinates
                </button>
              </div>

              {/* Address Input */}
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
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  color: '#0A0A0A',
                }}
                placeholder="Search for an address..."
              />

              {/* Address Suggestions */}
              {showAddressSuggestions && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                        gap: '10px',
                        background: '#fff',
                        border: '1px solid rgba(10,10,10,0.08)',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        fontSize: '13px',
                        color: '#0A0A0A',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>📍</span>
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* About */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>About</label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                style={{
                  border: '1px solid rgba(10,10,10,0.12)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  color: '#0A0A0A',
                  minHeight: '100px',
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', textTransform: 'uppercase' }}>
                Hero (square tile format, 1:1, 1080 x 1080 px) ℹ️
              </label>
              <div
                style={{
                  border: '2px dashed rgba(10,10,10,0.2)',
                  borderRadius: '10px',
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  textAlign: 'center',
                  background: 'rgba(10,10,10,0.02)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '28px' }}>🖼️</div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#0A0A0A' }}>Hero photo</div>
                <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.6)' }}>
                  or{' '}
                  <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>browse files</span>
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', textTransform: 'uppercase' }}>
                Gallery — photo or video, up to 6. Drag 🔶 to reorder ℹ️
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      border: '2px dashed rgba(10,10,10,0.2)',
                      borderRadius: '10px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      textAlign: 'center',
                      background: 'rgba(10,10,10,0.02)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '20px' }}>🔶</div>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#0A0A0A' }}>Drop photo or video</div>
                    <div style={{ fontSize: '10px', color: 'rgba(10,10,10,0.6)' }}>
                      or{' '}
                      <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>browse files</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.6)', textAlign: 'right' }}>+ 3 more</div>
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
