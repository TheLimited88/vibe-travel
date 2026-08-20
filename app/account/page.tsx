'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';

export default function AccountPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const isSignedIn = !!user;
  const [distanceUnit, setDistanceUnit] = useState('mi');
  const [newPlacesNearby, setNewPlacesNearby] = useState(true);
  const [geofencePrompts, setGeofencePrompts] = useState(false);

  const userInfo = {
    name: user?.displayName || 'there',
    email: user?.email || '',
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#FFFFFF' }}>
      <div style={{ width: '100%', maxWidth: '375px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '58px 16px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => router.back()}
                aria-label="Back"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '999px',
                  background: '#fff',
                  border: '1px solid rgba(10,10,10,0.08)',
                  cursor: 'pointer',
                  fontSize: '24px',
                }}
              >
                ‹
              </button>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#0A0A0A' }}>Account</div>
            </div>
          </div>

          {/* Signed Out State */}
          {!loading && !isSignedIn && (
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
              <div style={{
                background: '#fff',
                borderRadius: '18px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                alignItems: 'center',
                textAlign: 'center',
                border: '1px solid rgba(10,10,10,0.06)',
              }}>
                <div style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>
                  Sign in to manage your account, saved places, and visited places.
                </div>
                <button
                  onClick={() => router.push('/auth/create-account')}
                  style={{
                    background: '#3EE8A8',
                    color: '#0A0A0A',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '11px 22px',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  Sign in
                </button>
              </div>
            </div>
          )}

          {/* Signed In State */}
          {isSignedIn && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 24px' }}>
              {/* Profile Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
                  <span style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>Name</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#0A0A0A' }}>{userInfo.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
                  <span style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>Email</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#0A0A0A' }}>{userInfo.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
                  <span style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>Distance unit</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setDistanceUnit('mi')}
                      style={{
                        background: distanceUnit === 'mi' ? '#f0f0f0' : 'transparent',
                        border: '1px solid rgba(10,10,10,0.08)',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: distanceUnit === 'mi' ? '600' : '400',
                        color: '#0A0A0A',
                        cursor: 'pointer',
                      }}
                    >
                      mi
                    </button>
                    <button
                      onClick={() => setDistanceUnit('km')}
                      style={{
                        background: distanceUnit === 'km' ? '#f0f0f0' : 'transparent',
                        border: '1px solid rgba(10,10,10,0.08)',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: distanceUnit === 'km' ? '600' : '400',
                        color: '#0A0A0A',
                        cursor: 'pointer',
                      }}
                    >
                      km
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(10,10,10,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Notifications
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
                  <span style={{ fontSize: '14px', color: '#0A0A0A' }}>New Places nearby</span>
                  <button
                    onClick={() => setNewPlacesNearby(!newPlacesNearby)}
                    style={{
                      background: newPlacesNearby ? '#6B3FD1' : 'rgba(10,10,10,0.2)',
                      border: 'none',
                      borderRadius: '999px',
                      width: '44px',
                      height: '24px',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      width: '20px',
                      height: '20px',
                      background: '#fff',
                      borderRadius: '999px',
                      top: '2px',
                      left: newPlacesNearby ? '22px' : '2px',
                      transition: 'left 0.2s',
                    }} />
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
                  <span style={{ fontSize: '14px', color: '#0A0A0A' }}>Geofence arrival prompts</span>
                  <button
                    onClick={() => setGeofencePrompts(!geofencePrompts)}
                    style={{
                      background: geofencePrompts ? '#6B3FD1' : 'rgba(10,10,10,0.2)',
                      border: 'none',
                      borderRadius: '999px',
                      width: '44px',
                      height: '24px',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      width: '20px',
                      height: '20px',
                      background: '#fff',
                      borderRadius: '999px',
                      top: '2px',
                      left: geofencePrompts ? '22px' : '2px',
                      transition: 'left 0.2s',
                    }} />
                  </button>
                </div>
              </div>

              {/* Navigation Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '24px' }}>
                <button
                  onClick={() => router.push('/saved')}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: '1px solid rgba(10,10,10,0.06)',
                    background: 'none',
                    border: 'none',
                    font: 'inherit',
                    cursor: 'pointer',
                    color: '#0A0A0A',
                    fontSize: '14px',
                  }}
                >
                  Saved Places
                  <span style={{ fontSize: '20px', color: 'rgba(10,10,10,0.3)' }}>›</span>
                </button>
                <button
                  onClick={() => router.push('/visited')}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    background: 'none',
                    border: 'none',
                    font: 'inherit',
                    cursor: 'pointer',
                    color: '#0A0A0A',
                    fontSize: '14px',
                  }}
                >
                  Visited Places
                  <span style={{ fontSize: '20px', color: 'rgba(10,10,10,0.3)' }}>›</span>
                </button>
              </div>

              {/* Actions Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '24px', borderTop: '1px solid rgba(10,10,10,0.06)' }}>
                <button
                  onClick={handleSignOut}
                  style={{
                    padding: '12px 0',
                    background: 'none',
                    border: 'none',
                    font: 'inherit',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#0A0A0A',
                    textAlign: 'center',
                  }}
                >
                  Sign out
                </button>
                <button
                  style={{
                    padding: '12px 0',
                    background: 'none',
                    border: 'none',
                    font: 'inherit',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: 'rgba(10,10,10,0.6)',
                    textAlign: 'center',
                  }}
                >
                  Delete account
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div style={{
          background: '#FFFFFF',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          justifyContent: 'space-around',
          width: '100%',
          paddingBottom: '8px',
        }}>
          <Link href="/" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', cursor: 'pointer', textDecoration: 'none', paddingTop: '8px' }}>
            <div style={{ fontSize: '23px', lineHeight: '1' }}>⌂</div>
            <span>Home</span>
          </Link>

          <Link href="/search" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', cursor: 'pointer', textDecoration: 'none', paddingTop: '8px' }}>
            <div style={{ fontSize: '23px', lineHeight: '1' }}>⌕</div>
            <span>Search</span>
          </Link>

          <Link href="/saved" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', cursor: 'pointer', textDecoration: 'none', paddingTop: '8px' }}>
            <div style={{ fontSize: '23px', lineHeight: '1' }}>♥</div>
            <span>Saved</span>
          </Link>

          <Link href="/visited" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', cursor: 'pointer', textDecoration: 'none', paddingTop: '8px' }}>
            <div style={{ fontSize: '23px', lineHeight: '1' }}>✓</div>
            <span>Visited</span>
          </Link>

          <Link href="/account" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: '#6B3FD1', cursor: 'pointer', textDecoration: 'none', paddingTop: '8px' }}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" style={{ lineHeight: '1' }}>
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span>Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
