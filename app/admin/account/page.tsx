'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminAccountPage() {
  const router = useRouter();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profilePhotoKey, setProfilePhotoKey] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch('/api/admin/profile');
        const data = await res.json();
        if (data.success) {
          setProfilePhoto(data.photoUrl);
          setProfilePhotoKey(data.photoKey);
        }
      } catch (error) {
        console.error('Failed to load admin profile:', error);
      }
    };
    loadProfile();
  }, []);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'avatar');
      const uploadRes = await fetch('/api/admin/upload-image', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();

      if (uploadData.success) {
        await fetch('/api/admin/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photoUrl: uploadData.url, photoKey: uploadData.key }),
        });
        setProfilePhoto(uploadData.url);
        setProfilePhotoKey(uploadData.key);
      } else {
        alert(uploadData.error || 'Upload failed');
      }
    } catch (error) {
      alert('Upload failed');
    }
    setUploadingPhoto(false);
    e.target.value = '';
  };

  const handleDeletePhoto = async () => {
    try {
      if (profilePhotoKey) {
        await fetch('/api/admin/upload-image', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: profilePhotoKey }),
        });
      }
      await fetch('/api/admin/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoUrl: null, photoKey: null }),
      });
    } catch (error) {
      alert('Delete failed');
    }
    setProfilePhoto(null);
    setProfilePhotoKey(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/signin');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#fff' }}>
      <div style={{ width: '100%', maxWidth: '375px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Status Bar */}
        <div style={{ height: '44px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontSize: '12px', fontWeight: '600', borderBottom: '1px solid rgba(0,0,0,0.05)', flexShrink: 0 }}>
          <span>9:41</span>
          <span>●●●●●●●●●</span>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '24px 16px', gap: '20px' }}>
          {/* Header */}
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0A0A0A' }}>Admin Account</div>

          {/* Profile Photo Upload Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div
              onClick={uploadingPhoto ? undefined : handlePhotoClick}
              style={{ width: '120px', height: '120px', borderRadius: '12px', border: '2px dashed rgba(10,10,10,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: uploadingPhoto ? 'not-allowed' : 'pointer', background: 'transparent', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}
            >
              {uploadingPhoto ? (
                <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.5)' }}>Uploading...</div>
              ) : profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ fontSize: '24px' }}>+</div>
                  <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.5)', textAlign: 'center', lineHeight: '1.3' }}>Upload<br/>profile<br/>photo</div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.4)', textAlign: 'center' }}>Square photo, 1050x1050 px</div>
            {profilePhoto && (
              <button
                onClick={handleDeletePhoto}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#C23B3B',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '4px',
                }}
              >
                Delete photo
              </button>
            )}
          </div>

          {/* Account Info Card */}
          <div style={{ background: '#fff', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(10,10,10,0.06)' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(10,10,10,0.07)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'rgba(10,10,10,0.6)' }}>Name</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#0A0A0A' }}>Brett Williams</span>
            </div>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(10,10,10,0.07)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'rgba(10,10,10,0.6)' }}>Email</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#0A0A0A' }}>hello@nearbyvibes.com</span>
            </div>
            <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'rgba(10,10,10,0.6)' }}>Role</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#0A0A0A' }}>Content admin</span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button onClick={handleSignOut} style={{ background: '#3EE8A8', border: 'none', borderRadius: '14px', padding: '14px 16px', fontSize: '14px', fontWeight: '700', color: '#0A0A0A', cursor: 'pointer' }}>Sign out</button>
        </div>

        {/* Admin Bottom Navigation */}
        <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(10,10,10,0.07)', display: 'flex', padding: '8px 6px 24px', flexShrink: 0, gap: 0, justifyContent: 'space-around', zIndex: 30 }}>
          <button onClick={() => router.push('/admin/place/new')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
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
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: '#6B3FD1', background: 'none', border: 'none', cursor: 'not-allowed', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8"/></svg>
            <span>Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
