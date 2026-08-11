'use client';

import { useState } from 'react';

const contentPages = [
  { key: 'about', label: 'About', title: 'About Vibe Travel' },
  { key: 'help', label: 'Help', title: 'Help' },
  { key: 'terms', label: 'Terms', title: 'Terms of Service' },
  { key: 'privacy', label: 'Privacy', title: 'Privacy Policy' },
  { key: 'acceptable_use', label: 'Acceptable Use', title: 'Acceptable Use' },
  { key: 'cookies', label: 'Cookies', title: 'Cookie Policy' },
];

export default function ContentPage() {
  const [selectedTab, setSelectedTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [sections, setSections] = useState([
    { id: 1, type: 'header', content: 'About Vibe Travel' },
    { id: 2, type: 'text', content: 'Vibe Travel is a curated atlas of the city\'s overlooked corners, written and photographed by a single guide rather than crowdsourced from everyone. We believe the best travel recommendations come from someone who\'s actually been there twice.' },
  ]);

  const currentPage = contentPages.find(p => p.key === selectedTab);

  const addSection = (type: 'header' | 'text' | 'youtube') => {
    const newId = Math.max(...sections.map(s => s.id), 0) + 1;
    setSections([...sections, { id: newId, type, content: '' }]);
  };

  const removeSection = (id: number) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const moveSection = (id: number, direction: 'up' | 'down') => {
    const index = sections.findIndex(s => s.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) return;
    const newSections = [...sections];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[swapIndex]] = [newSections[swapIndex], newSections[index]];
    setSections(newSections);
  };

  const updateSection = (id: number, content: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, content } : s));
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
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)', zIndex: 10 }}>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0A0A0A' }}>Content Pages</div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', fontSize: '14px', color: '#0A0A0A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ✏️ Edit
            </button>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflow: 'x', padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.07)', background: '#fff', flexShrink: 0 }}>
          {contentPages.map((page) => (
            <button
              key={page.key}
              onClick={() => setSelectedTab(page.key)}
              style={{
                background: selectedTab === page.key ? '#7F53F3' : '#fff',
                color: selectedTab === page.key ? '#fff' : '#0A0A0A',
                border: selectedTab === page.key ? 'none' : '1px solid rgba(10,10,10,0.12)',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {page.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {isEditing ? (
            // Edit Mode
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px 16px' }}>
              {sections.map((section, index) => (
                <div key={section.id} style={{ background: '#f9f8f6', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '12px', padding: '12px', display: 'flex', gap: '8px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(10,10,10,0.45)', textTransform: 'uppercase' }}>{section.type.toUpperCase()}</label>
                    <input
                      type="text"
                      value={section.content}
                      onChange={(e) => updateSection(section.id, e.target.value)}
                      style={{ border: '1px solid rgba(10,10,10,0.12)', borderRadius: '8px', padding: '8px', fontSize: '13px', fontFamily: 'inherit', color: '#0A0A0A' }}
                      placeholder={section.type === 'header' ? 'Section title' : 'Enter content'}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button onClick={() => moveSection(section.id, 'up')} disabled={index === 0} style={{ width: '32px', height: '32px', borderRadius: '6px', background: index === 0 ? 'rgba(10,10,10,0.07)' : '#fff', border: '1px solid rgba(10,10,10,0.12)', cursor: index === 0 ? 'not-allowed' : 'pointer', fontSize: '12px', color: 'rgba(10,10,10,0.5)' }}>↑</button>
                    <button onClick={() => moveSection(section.id, 'down')} disabled={index === sections.length - 1} style={{ width: '32px', height: '32px', borderRadius: '6px', background: index === sections.length - 1 ? 'rgba(10,10,10,0.07)' : '#fff', border: '1px solid rgba(10,10,10,0.12)', cursor: index === sections.length - 1 ? 'not-allowed' : 'pointer', fontSize: '12px', color: 'rgba(10,10,10,0.5)' }}>↓</button>
                    <button onClick={() => removeSection(section.id)} style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#fff', border: '1px solid rgba(10,10,10,0.12)', cursor: 'pointer', fontSize: '12px', color: '#C53855' }}>✕</button>
                  </div>
                </div>
              ))}

              {/* Add Section Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => addSection('header')} style={{ flex: 1, border: '1px solid rgba(10,10,10,0.12)', background: '#fff', borderRadius: '8px', padding: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', color: '#0A0A0A' }}>+ Header</button>
                <button onClick={() => addSection('text')} style={{ flex: 1, border: '1px solid rgba(10,10,10,0.12)', background: '#fff', borderRadius: '8px', padding: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', color: '#0A0A0A' }}>+ Text</button>
                <button onClick={() => addSection('youtube')} style={{ flex: 1, border: '1px solid rgba(10,10,10,0.12)', background: '#fff', borderRadius: '8px', padding: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', color: '#0A0A0A' }}>+ YouTube Video</button>
              </div>

              {/* Version History */}
              <div style={{ marginTop: '8px' }}>
                <button onClick={() => setShowVersionHistory(!showVersionHistory)} style={{ fontSize: '12px', color: '#7F53F3', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showVersionHistory ? 'Hide' : 'View'} version history
                </button>
              </div>

              {showVersionHistory && (
                <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.6)', padding: '12px', background: 'rgba(10,10,10,0.03)', borderRadius: '8px' }}>
                  v1.0 · Published 3 Jan 2026<br/>Current version
                </div>
              )}
            </div>
          ) : (
            // View Mode
            <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {sections.map((section) => (
                <div key={section.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {section.type === 'header' && (
                    <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0A0A0A', margin: 0 }}>{section.content}</h2>
                  )}
                  {section.type === 'text' && (
                    <p style={{ fontSize: '14px', color: 'rgba(10,10,10,0.7)', margin: 0, lineHeight: '1.6' }}>{section.content}</p>
                  )}
                  {section.type === 'youtube' && section.content && (
                    <div style={{ width: '100%', height: '200px', borderRadius: '12px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'rgba(10,10,10,0.6)' }}>▶ YouTube Video</div>
                  )}
                </div>
              ))}

              {/* Version Info */}
              {showVersionHistory && (
                <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.6)', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(10,10,10,0.1)' }}>
                  v1.0 · Published 3 Jan 2026<br/>
                  <span style={{ color: '#7F53F3' }}>Current version</span>
                </div>
              )}
              <button onClick={() => setShowVersionHistory(!showVersionHistory)} style={{ fontSize: '12px', color: '#7F53F3', background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', textDecoration: 'underline' }}>
                {showVersionHistory ? 'Hide' : 'View'} version history
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div style={{ display: 'flex', gap: '12px', padding: '16px', borderTop: '1px solid rgba(10,10,10,0.08)', background: '#fff' }}>
            <button onClick={() => setIsEditing(false)} style={{ flex: 1, background: '#fff', color: '#0A0A0A', border: '1px solid rgba(10,10,10,0.12)', borderRadius: '12px', padding: '12px', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
            <button onClick={() => setIsEditing(false)} style={{ flex: 1, background: '#3EE8A8', color: '#0A0A0A', border: 'none', borderRadius: '12px', padding: '12px', fontSize: '13.5px', fontWeight: '700', cursor: 'pointer' }}>Save</button>
          </div>
        )}

        {/* Admin Bottom Navigation */}
        <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(10,10,10,0.07)', display: 'flex', padding: '8px 6px 24px', flexShrink: 0, gap: 0, justifyContent: 'space-around', zIndex: 30 }}>
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="9.5" r="2.6" stroke="currentColor" strokeWidth="1.8"/></svg>
            <span>Places</span>
          </button>
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: '#7F53F3', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l11-11-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.8"/></svg>
            <span>Content</span>
          </button>
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.3" stroke="currentColor" strokeWidth="1.8"/><path d="M2.5 20c1.2-3.6 3.8-5.4 6.5-5.4s5.3 1.8 6.5 5.4" stroke="currentColor" strokeWidth="1.8"/><circle cx="17.5" cy="8.5" r="2.6" stroke="currentColor" strokeWidth="1.6"/><path d="M15.5 14.6c2.2.3 4 1.8 5 4.9" stroke="currentColor" strokeWidth="1.6"/></svg>
            <span>Users</span>
          </button>
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8"/></svg>
            <span>Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
