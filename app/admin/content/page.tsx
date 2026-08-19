'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const contentPages = [
  { key: 'about', label: 'About', title: 'About Vibe Travel' },
  { key: 'help', label: 'Help', title: 'Help' },
  { key: 'terms', label: 'Terms', title: 'Terms of Service' },
  { key: 'privacy', label: 'Privacy', title: 'Privacy Policy' },
  { key: 'acceptable_use', label: 'Acceptable Use', title: 'Acceptable Use' },
  { key: 'cookies', label: 'Cookies', title: 'Cookie Policy' },
];

interface Section {
  id: number;
  type: 'header' | 'text' | 'youtube';
  content: string;
}

interface ContentVersion {
  version: string;
  publishedDate: string;
  sections: Section[];
  createdAt: number;
}

function getYoutubeThumbUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

const DEFAULT_ABOUT_SECTIONS: Section[] = [
  { id: 1, type: 'header', content: 'About Vibe Travel' },
  { id: 2, type: 'text', content: 'Vibe Travel is a curated atlas of the city\'s overlooked corners, written and photographed by a single guide rather than crowdsourced from everyone. We believe the best travel recommendations come from someone who\'s actually been there twice.' },
];

export default function ContentPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [previewVersionIndex, setPreviewVersionIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const currentPage = contentPages.find(p => p.key === selectedTab);
  const latestVersion = versions.length > 0 ? versions[versions.length - 1] : null;
  const savedSections = latestVersion ? latestVersion.sections : (selectedTab === 'about' ? DEFAULT_ABOUT_SECTIONS : []);
  const displaySections = previewVersionIndex !== null ? versions[previewVersionIndex].sections : sections;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setIsEditing(false);
    setPreviewVersionIndex(null);
    fetch(`/api/admin/content?key=${selectedTab}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.success) {
          const loadedVersions: ContentVersion[] = data.versions || [];
          const latest = loadedVersions.length > 0 ? loadedVersions[loadedVersions.length - 1] : null;
          setVersions(loadedVersions);
          setSections(latest ? latest.sections : selectedTab === 'about' ? DEFAULT_ABOUT_SECTIONS : []);
        }
      })
      .catch((error) => console.error('Failed to load content page:', error))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [selectedTab]);

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

  const handleCancel = () => {
    setSections(savedSections);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: selectedTab, sections }),
      });
      const data = await res.json();
      if (data.success) {
        setVersions([...versions, data.version]);
        setPreviewVersionIndex(null);
        setToast(`Content page saved as ${data.version.version}`);
        setIsEditing(false);
      } else {
        setToast(data.error || 'Save failed');
      }
    } catch (error) {
      setToast('Network error — save failed');
    }
    setSaving(false);
    setTimeout(() => setToast(''), 2500);
  };

  const viewVersion = (index: number) => {
    setPreviewVersionIndex(index);
    setIsEditing(false);
  };

  const restoreVersion = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSections(versions[index].sections);
    setPreviewVersionIndex(null);
    setShowVersionHistory(false);
    setIsEditing(true);
  };

  const versionListItems = [...versions].reverse().map((v, revIdx) => {
    const origIdx = versions.length - 1 - revIdx;
    const isCurrent = origIdx === versions.length - 1;
    const next = versions[origIdx + 1];
    return {
      origIdx,
      version: v.version,
      publishedDate: v.publishedDate,
      statusLabel: isCurrent ? 'Current version' : `Superseded ${next.publishedDate} by ${next.version}`,
      statusColor: isCurrent ? '#0A7A52' : 'rgba(10,10,10,0.5)',
      canRestore: !isCurrent,
    };
  });

  const VersionHistoryPanel = () => (
    <div style={{ background: '#fff', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '14px', padding: '4px', display: 'flex', flexDirection: 'column', maxHeight: '260px', overflowY: 'auto' }}>
      {versionListItems.length === 0 ? (
        <div style={{ padding: '14px 10px', fontSize: '12.5px', color: 'rgba(10,10,10,0.5)', textAlign: 'center' }}>Not yet saved</div>
      ) : (
        versionListItems.map((v) => (
          <div
            key={v.origIdx}
            role="button"
            tabIndex={0}
            onClick={() => viewVersion(v.origIdx)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '10px 10px', borderBottom: '1px solid rgba(10,10,10,0.06)', width: '100%', textAlign: 'left', font: 'inherit', cursor: 'pointer', background: previewVersionIndex === v.origIdx ? 'rgba(107,63,209,0.06)' : 'transparent' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#0A0A0A' }}>{v.version} · Published {v.publishedDate}</span>
              <span style={{ fontSize: '11.5px', color: v.statusColor }}>{v.statusLabel}</span>
            </div>
            {v.canRestore && (
              <button onClick={(e) => restoreVersion(v.origIdx, e)} style={{ background: 'rgba(10,10,10,0.06)', border: 'none', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', fontWeight: '700', color: '#0A0A0A', flexShrink: 0, cursor: 'pointer' }}>Restore</button>
            )}
          </div>
        ))
      )}
    </div>
  );

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
          {isEditing ? (
            <button onClick={() => setIsEditing(false)} style={{ background: 'rgba(10,10,10,0.06)', border: 'none', borderRadius: '999px', padding: '8px 14px', fontSize: '12.5px', fontWeight: '700', color: '#0A0A0A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8"/></svg>
              Preview
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} style={{ background: 'rgba(10,10,10,0.06)', border: 'none', borderRadius: '999px', padding: '8px 14px', fontSize: '12.5px', fontWeight: '700', color: '#0A0A0A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l11-11-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.8"/></svg>
              Edit
            </button>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.07)', background: '#fff', flexShrink: 0 }}>
          {contentPages.map((page) => (
            <button
              key={page.key}
              onClick={() => setSelectedTab(page.key)}
              style={{
                background: selectedTab === page.key ? '#6B3FD1' : '#fff',
                color: selectedTab === page.key ? '#fff' : '#0A0A0A',
                border: selectedTab === page.key ? 'none' : '1px solid rgba(10,10,10,0.12)',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {page.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <div style={{ padding: '40px 16px', textAlign: 'center', fontSize: '13px', color: 'rgba(10,10,10,0.5)' }}>Loading…</div>
          ) : isEditing ? (
            // Edit Mode
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px 16px' }}>
              {sections.map((section, index) => (
                <div key={section.id} style={{ border: '1px solid rgba(10,10,10,0.1)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(10,10,10,0.45)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{section.type.toUpperCase()}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => moveSection(section.id, 'up')} disabled={index === 0} style={{ background: index === 0 ? 'rgba(10,10,10,0.06)' : 'rgba(10,10,10,0.06)', border: 'none', borderRadius: '10px', width: '44px', height: '44px', fontSize: '13px', color: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.5 : 1 }}>↑</button>
                      <button onClick={() => moveSection(section.id, 'down')} disabled={index === sections.length - 1} style={{ background: 'rgba(10,10,10,0.06)', border: 'none', borderRadius: '10px', width: '44px', height: '44px', fontSize: '13px', color: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: index === sections.length - 1 ? 'not-allowed' : 'pointer', opacity: index === sections.length - 1 ? 0.5 : 1 }}>↓</button>
                      <button onClick={() => removeSection(section.id)} style={{ background: 'rgba(220,50,50,0.08)', border: 'none', borderRadius: '10px', width: '44px', height: '44px', fontSize: '13px', color: '#c33', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>✕</button>
                    </div>
                  </div>
                  {section.type === 'header' && (
                    <input
                      type="text"
                      value={section.content}
                      onChange={(e) => updateSection(section.id, e.target.value)}
                      style={{ border: '1px solid rgba(10,10,10,0.1)', borderRadius: '10px', padding: '10px 12px', fontSize: '15px', fontWeight: '700', fontFamily: 'inherit', color: '#0A0A0A' }}
                      placeholder="Section header"
                    />
                  )}
                  {section.type === 'text' && (
                    <textarea
                      value={section.content}
                      onChange={(e) => updateSection(section.id, e.target.value)}
                      rows={5}
                      style={{ border: '1px solid rgba(10,10,10,0.1)', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontFamily: 'inherit', color: '#0A0A0A', resize: 'none' }}
                      placeholder="Section text"
                    />
                  )}
                  {section.type === 'youtube' && (
                    <input
                      type="text"
                      value={section.content}
                      onChange={(e) => updateSection(section.id, e.target.value)}
                      style={{ border: '1px solid rgba(10,10,10,0.1)', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', fontFamily: 'inherit', color: '#0A0A0A' }}
                      placeholder="https://youtube.com/watch?v=…"
                    />
                  )}
                </div>
              ))}

              {/* Add Section Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => addSection('header')} style={{ background: 'rgba(10,10,10,0.06)', border: 'none', borderRadius: '10px', padding: '9px 14px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', color: '#0A0A0A' }}>+ Header</button>
                <button onClick={() => addSection('text')} style={{ background: 'rgba(10,10,10,0.06)', border: 'none', borderRadius: '10px', padding: '9px 14px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', color: '#0A0A0A' }}>+ Text</button>
                <button onClick={() => addSection('youtube')} style={{ background: 'rgba(10,10,10,0.06)', border: 'none', borderRadius: '10px', padding: '9px 14px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', color: '#0A0A0A' }}>+ YouTube Video</button>
              </div>

              {/* Version History */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                <button onClick={() => setShowVersionHistory(!showVersionHistory)} style={{ fontSize: '12px', color: '#6B3FD1', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showVersionHistory ? 'Hide' : 'View'} version history
                </button>
              </div>

              {showVersionHistory && <VersionHistoryPanel />}
            </div>
          ) : (
            <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {previewVersionIndex !== null && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', background: 'rgba(107,63,209,0.08)', borderRadius: '10px', padding: '10px 12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#6B3FD1' }}>
                    Viewing {versions[previewVersionIndex].version} · Published {versions[previewVersionIndex].publishedDate}
                  </span>
                  <button onClick={() => setPreviewVersionIndex(null)} style={{ fontSize: '12px', fontWeight: '700', color: '#6B3FD1', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', flexShrink: 0 }}>Back to current</button>
                </div>
              )}
              {displaySections.length === 0 && (
                <div style={{ fontSize: '13px', color: 'rgba(10,10,10,0.5)', textAlign: 'center', padding: '20px 0' }}>No content yet — tap Edit to add sections.</div>
              )}
              {displaySections.map((section) => (
                <div key={section.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {section.type === 'header' && (
                    <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0A0A0A', margin: 0 }}>{section.content}</h2>
                  )}
                  {section.type === 'text' && (
                    <p style={{ fontSize: '14px', color: 'rgba(10,10,10,0.7)', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{section.content}</p>
                  )}
                  {section.type === 'youtube' && section.content && (
                    getYoutubeThumbUrl(section.content) ? (
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: '12px', overflow: 'hidden', background: '#0A0A0A' }}>
                        <img src={getYoutubeThumbUrl(section.content)!} alt="YouTube thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.5)" /><path d="M10 8l6 4-6 4V8z" fill="#fff" /></svg>
                        </div>
                      </div>
                    ) : (
                      <div style={{ width: '100%', height: '200px', borderRadius: '12px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'rgba(10,10,10,0.6)' }}>▶ YouTube Video</div>
                    )
                  )}
                </div>
              ))}
              {showVersionHistory && <VersionHistoryPanel />}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                <button onClick={() => setShowVersionHistory(!showVersionHistory)} style={{ fontSize: '12px', color: '#6B3FD1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}>
                  {showVersionHistory ? 'Hide' : 'View'} version history
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div style={{ display: 'flex', gap: '8px', padding: '16px', borderTop: '1px solid rgba(10,10,10,0.08)', background: '#fff', justifyContent: 'center' }}>
            <button onClick={handleCancel} disabled={saving} style={{ background: '#fff', color: '#0A0A0A', border: '1px solid rgba(10,10,10,0.12)', borderRadius: '14px', padding: '13px 26px', fontSize: '14px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer' }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ background: '#3EE8A8', color: '#0A0A0A', border: 'none', borderRadius: '14px', padding: '13px 32px', fontSize: '14px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        )}

        {toast && (
          <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: '#0A0A0A', color: '#fff', fontSize: '13px', fontWeight: '600', padding: '12px 20px', borderRadius: '999px', boxShadow: '0 6px 20px rgba(0,0,0,0.25)', zIndex: 999 }}>
            {toast}
          </div>
        )}

        {/* Admin Bottom Navigation */}
        <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(10,10,10,0.07)', display: 'flex', padding: '8px 6px 24px', flexShrink: 0, gap: 0, justifyContent: 'space-around', zIndex: 30 }}>
          <button onClick={() => router.push('/admin/places')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="9.5" r="2.6" stroke="currentColor" strokeWidth="1.8"/></svg>
            <span>Places</span>
          </button>
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: '#6B3FD1', background: 'none', border: 'none', cursor: 'not-allowed', flex: 1 }}>
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
