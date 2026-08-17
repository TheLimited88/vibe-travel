'use client';

import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#fff', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '375px', display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '40px' }}>
        <div style={{ fontSize: '24px', fontWeight: '800', color: '#0A0A0A', textAlign: 'center' }}>
          Admin Dashboard
        </div>

        <div style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)', textAlign: 'center' }}>
          Welcome to the Vibe Travel admin portal. Select an option below.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => router.push('/admin/account')}
            style={{
              background: '#fff',
              border: '1px solid rgba(10,10,10,0.1)',
              borderRadius: '14px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#0A0A0A',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            👤 My Account
          </button>

          <button
            onClick={() => router.push('/admin/users')}
            style={{
              background: '#fff',
              border: '1px solid rgba(10,10,10,0.1)',
              borderRadius: '14px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#0A0A0A',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            👥 Manage Users
          </button>

          <button
            onClick={() => router.push('/admin/content')}
            style={{
              background: '#fff',
              border: '1px solid rgba(10,10,10,0.1)',
              borderRadius: '14px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#0A0A0A',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            📝 Manage Content
          </button>

          <button
            onClick={() => {
              localStorage.removeItem('adminToken');
              localStorage.removeItem('admin2FAVerified');
              router.push('/admin/signin');
            }}
            style={{
              background: '#fff',
              border: '1px solid rgba(10,10,10,0.1)',
              borderRadius: '14px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#C23B3B',
              cursor: 'pointer',
              textAlign: 'center',
              marginTop: '20px',
            }}
          >
            🚪 Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
