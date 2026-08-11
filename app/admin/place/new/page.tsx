'use client';

import { useState } from 'react';

export default function NewPlacePage() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('hidden_beach');
  const [address, setAddress] = useState('');
  const [about, setAbout] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [preview, setPreview] = useState(false);

  if (preview) {
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
            <button onClick={() => setPreview(false)} style={{ width: '44px', height: '44px', borderRadius: '999px', background: '#fff', border: '1px solid rgba(10,10,10,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px', flexShrink: 0 }}>‹</button>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0A0A0A', flex: 1 }}>Preview</div>
            <div></div>
          </div>

          {/* Post Preview Content */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Hero Image */}
            <div style={{ width: '100%', height: '220px', background: '#f0f0f0', border: '2px dashed rgba(10,10,10,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(10,10,10,0.6)', fontSize: '12px', flexShrink: 0 }}>Hero Image</div>

            {/* Content Scroll Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Title & Subtitle */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0A0A0A', margin: 0, lineHeight: '1.2' }}>{title || 'Untitled place'}</h1>
                <p style={{ fontSize: '16px', color: 'rgba(10,10,10,0.6)', margin: 0, lineHeight: '1.4' }}>{subtitle || 'No description provided'}</p>
              </div>

              {/* Category Badge & Location */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', padding: '6px 12px', borderRadius: '16px', background: '#7F53F3', color: '#fff', width: 'fit-content' }}>{category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(10,10,10,0.7)' }}>
                  <span>📍</span>
                  <span>{address || 'No location'}</span>
                </div>
              </div>

              {/* Stats Section */}
              <div style={{ display: 'flex', justifyContent: 'space-around', padding: '14px 0', borderTop: '1px solid rgba(10,10,10,0.08)', borderBottom: '1px solid rgba(10,10,10,0.08)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#0A0A0A' }}>0</div>
                  <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.5)' }}>Likes</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#0A0A0A' }}>0</div>
                  <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.5)' }}>Saves</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#0A0A0A' }}>0</div>
                  <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.5)' }}>Visits</div>
                </div>
              </div>

              {/* About Section */}
              {about && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0A0A0A', margin: 0 }}>About this place</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(10,10,10,0.7)', margin: 0, lineHeight: '1.6' }}>{about}</p>
                </div>
              )}

              {/* Gallery */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ flexShrink: 0, width: '80px', height: '140px', borderRadius: '10px', background: '#f0f0f0', border: '1px solid rgba(10,10,10,0.1)' }}></div>
                ))}
              </div>

              {/* YouTube Video */}
              {youtubeUrl && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0A0A0A', margin: 0 }}>Featured Video</h3>
                  <div style={{ width: '100%', height: '200px', borderRadius: '12px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(10,10,10,0.4)', fontSize: '13px' }}>▶ Video Preview</div>
                </div>
              )}
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
          <button onClick={() => setPreview(!preview)} style={{ background: preview ? '#7F53F3' : 'rgba(10,10,10,0.06)', border: 'none', borderRadius: '999px', padding: '8px 14px', fontSize: '12.5px', fontWeight: '700', color: preview ? '#fff' : '#0A0A0A', cursor: 'pointer' }}>◎ Preview</button>
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
            <label style={{ fontSize: '11px', fontWeight: '600', color: '#7F53F3', textTransform: 'uppercase' }}>SEO URL (generated from title)</label>
            <div style={{ fontSize: '12px', color: '#7F53F3', wordBreak: 'break-all' }}>vibetravel.app/places/{title.toLowerCase().replace(/\s+/g, '-') || 'untitled-place'}</div>
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
              <optgroup label="Popular">
                <option value="hidden_beach">Hidden Beach</option>
                <option value="scenic_lookout">Scenic Lookout</option>
                <option value="historic_building">Historic Building</option>
              </optgroup>
              <optgroup label="All categories">
                <option value="waterfall">Waterfall</option>
                <option value="street_art">Street Art</option>
                <option value="walking_trail">Walking Trail</option>
                <option value="local_market">Local Market</option>
                <option value="photography_location">Photography Spot</option>
                <option value="quiet_escape">Quiet Escape</option>
              </optgroup>
            </select>
          </div>

          {/* Location */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Location</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ border: 'none', borderRadius: '999px', padding: '8px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', background: '#7F53F3', color: '#fff' }}>Address</button>
              <button style={{ background: '#fff', color: '#0A0A0A', border: '1px solid rgba(10,10,10,0.12)', borderRadius: '999px', padding: '8px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>GPS Coordinates</button>
            </div>
            <input type="text" placeholder="Search Google Maps address…" value={address} onChange={(e) => setAddress(e.target.value)} style={{ border: '1px solid rgba(10,10,10,0.12)', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontFamily: 'inherit', color: '#0A0A0A' }} />
            <div style={{ position: 'relative', height: '110px', borderRadius: '10px', overflow: 'hidden', background: 'repeating-linear-gradient(0deg, rgba(10,10,10,0.035) 0 1px, transparent 1px 22px), repeating-linear-gradient(90deg, rgba(10,10,10,0.035) 0 1px, transparent 1px 22px), #eef0ea', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', width: '22px', height: '22px', borderRadius: '999px 999px 999px 0', background: '#7F53F3', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }}></div>
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
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E8D5F2', flexShrink: 0 }}></div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#7F53F3' }}>Brett Williams</div>
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
            <label style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', textTransform: 'uppercase' }}>Video links (Reels/TikToks/clips of this place on other platforms)</label>
            <button style={{ border: '2px dashed #7F53F3', background: 'transparent', borderRadius: '10px', padding: '10px 12px', fontSize: '13px', fontWeight: '600', color: '#7F53F3', cursor: 'pointer' }}>+ Add video link</button>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button style={{ flex: 1, background: '#fff', color: '#0A0A0A', border: '1px solid rgba(10,10,10,0.12)', borderRadius: '12px', padding: '12px', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer' }}>Save Draft</button>
            <button style={{ flex: 1, background: '#95048B', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px', fontSize: '13.5px', fontWeight: '700', cursor: 'pointer' }}>Publish</button>
          </div>

          <div style={{ height: '20px' }}></div>
        </div>
      </div>
    </div>
  );
}
