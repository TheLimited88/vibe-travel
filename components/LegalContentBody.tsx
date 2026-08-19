'use client';

import { useState, useEffect } from 'react';

interface Section {
  id: number;
  type: 'header' | 'text' | 'youtube';
  content: string;
}

function getYoutubeThumbUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

export default function LegalContentBody({ contentKey }: { contentKey: string }) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/content?key=${contentKey}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data.success) return;
        const versions = data.versions || [];
        const latest = versions.length > 0 ? versions[versions.length - 1] : null;
        // Skip a leading header section — the page already shows its own <h1> title.
        const loaded: Section[] = latest ? latest.sections : [];
        setSections(loaded[0]?.type === 'header' ? loaded.slice(1) : loaded);
      })
      .catch((error) => console.error('Failed to load legal content:', error))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [contentKey]);

  if (loading) {
    return <div style={{ minHeight: '400px', background: '#FFFFFF' }} />;
  }

  if (sections.length === 0) {
    return (
      <div style={{ minHeight: '400px', background: '#FFFFFF', fontSize: '14px', color: 'rgba(10,10,10,0.5)' }}>
        This page hasn't been published yet.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      {sections.map((section) => (
        <div key={section.id}>
          {section.type === 'header' && (
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0A0A0A', margin: '0 0 8px' }}>{section.content}</h2>
          )}
          {section.type === 'text' && (
            <p style={{ fontSize: '14px', color: 'rgba(10,10,10,0.75)', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{section.content}</p>
          )}
          {section.type === 'youtube' && section.content && (
            getYoutubeThumbUrl(section.content) ? (
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: '12px', overflow: 'hidden', background: '#0A0A0A' }}>
                <img src={getYoutubeThumbUrl(section.content)!} alt="YouTube video" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.5)" /><path d="M10 8l6 4-6 4V8z" fill="#fff" /></svg>
                </div>
              </div>
            ) : (
              <div style={{ width: '100%', height: '200px', borderRadius: '12px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'rgba(10,10,10,0.6)' }}>▶ Video</div>
            )
          )}
        </div>
      ))}
    </div>
  );
}
