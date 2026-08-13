'use client';

import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  saved: number;
  visited: number;
  signupMethod: string;
  status: 'active' | 'suspended';
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jordan Lee',
    email: 'jordan.lee@example.com',
    avatar: 'JL',
    joinDate: '3 Jan 2026',
    saved: 12,
    visited: 8,
    signupMethod: 'Google',
    status: 'active',
  },
  {
    id: '2',
    name: 'Priya Anand',
    email: 'priya.anand@example.com',
    avatar: 'PA',
    joinDate: '18 Nov 2025',
    saved: 24,
    visited: 19,
    signupMethod: 'Email',
    status: 'active',
  },
  {
    id: '3',
    name: 'Marcus Webb',
    email: 'marcus.webb@example.com',
    avatar: 'MW',
    joinDate: '2 Sep 2025',
    saved: 5,
    visited: 3,
    signupMethod: 'Apple',
    status: 'active',
  },
  {
    id: '4',
    name: 'Sofia Ramirez',
    email: 'sofia.ramirez@example.com',
    avatar: 'SR',
    joinDate: '27 Jul 2025',
    saved: 31,
    visited: 22,
    signupMethod: 'Google',
    status: 'suspended',
  },
];

const avatarColors: { [key: string]: string } = {
  JL: '#6B3FD1',
  PA: '#6B3FD1',
  MW: '#6B3FD1',
  SR: '#6B3FD1',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', status: 'active' as 'active' | 'suspended' });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email, status: user.status });
  };

  const handleSaveEdit = () => {
    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: editForm.name, email: editForm.email, status: editForm.status }
            : u
        )
      );
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId));
    setShowDeleteConfirm(null);
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
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)', zIndex: 10 }}>
          <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: 0 }}>‹</button>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0A0A0A' }}>Users</div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* Search */}
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '12px', padding: '10px 14px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="7" stroke="rgba(10,10,10,0.5)" strokeWidth="2" />
                <path d="M21 21l-4.3-4.3" stroke="rgba(10,10,10,0.5)" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search users"
                aria-label="Search users"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', fontFamily: 'inherit', background: 'transparent', color: '#0A0A0A' }}
              />
            </div>
          </div>

          {/* Users List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 16px 16px' }}>
            {filteredUsers.map((user) => (
              <div key={user.id} style={{ background: '#fff', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '12px', padding: '12px', display: 'flex', gap: '12px' }}>
                {/* Avatar */}
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '999px',
                    background: avatarColors[user.avatar] || '#6B3FD1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '14px',
                    flexShrink: 0,
                  }}
                >
                  {user.avatar}
                </div>

                {/* User Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0A0A0A' }}>{user.name}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.6)', marginTop: '2px' }}>{user.email}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.5)', marginTop: '4px' }}>
                    Joined {user.joinDate} · {user.saved} saved · {user.visited} visited
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.5)', marginTop: '2px' }}>Signed up via {user.signupMethod}</div>
                  <div style={{ marginTop: '8px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        background: user.status === 'active' ? 'rgba(10,155,113,0.1)' : 'rgba(220,50,50,0.1)',
                        color: user.status === 'active' ? '#0A9B71' : '#C53855',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                      }}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleEditClick(user)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: 'rgba(10,10,10,0.06)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M4 20h4l11-11-4-4L4 16v4z" stroke="#0A0A0A" strokeWidth="1.8" strokeLinejoin="round" />
                      <path d="M14 6l4 4" stroke="#0A0A0A" strokeWidth="1.8" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(user.id)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: 'rgba(220,50,50,0.1)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="#C53855" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Bottom Navigation */}
        <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(10,10,10,0.07)', display: 'flex', padding: '8px 6px 24px', flexShrink: 0, gap: 0, justifyContent: 'space-around', zIndex: 30 }}>
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="9.5" r="2.6" stroke="currentColor" strokeWidth="1.8"/></svg>
            <span>Places</span>
          </button>
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l11-11-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.8"/></svg>
            <span>Content</span>
          </button>
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: '#6B3FD1', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.3" stroke="currentColor" strokeWidth="1.8"/><path d="M2.5 20c1.2-3.6 3.8-5.4 6.5-5.4s5.3 1.8 6.5 5.4" stroke="currentColor" strokeWidth="1.8"/><circle cx="17.5" cy="8.5" r="2.6" stroke="currentColor" strokeWidth="1.6"/><path d="M15.5 14.6c2.2.3 4 1.8 5 4.9" stroke="currentColor" strokeWidth="1.6"/></svg>
            <span>Users</span>
          </button>
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8"/></svg>
            <span>Account</span>
          </button>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.45)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }}>
          <div style={{ background: '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '375px', padding: '24px 16px 32px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#0A0A0A' }}>Edit user</div>

            {/* Profile Photo Upload */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '999px', border: '2px dashed rgba(10,10,10,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(10,10,10,0.02)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Profile</div>
                  <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.5)' }}>photo</div>
                  <div style={{ fontSize: '10px', color: 'rgba(10,10,10,0.4)', marginTop: '2px' }}>or browse</div>
                  <div style={{ fontSize: '10px', color: 'rgba(10,10,10,0.4)' }}>files</div>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.5)', textAlign: 'center', lineHeight: '1.4' }}>
                Square photo, 1050x1050 px — shown as a circle everywhere, incl. Place created by
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                style={{ border: '1px solid rgba(10,10,10,0.12)', borderRadius: '12px', padding: '12px', fontSize: '14px', fontFamily: 'inherit', color: '#0A0A0A' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Email</span>
                <span style={{ color: 'rgba(10,10,10,0.4)' }}>{editForm.email.length}/100</span>
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                style={{ border: '1px solid rgba(10,10,10,0.12)', borderRadius: '12px', padding: '12px', fontSize: '14px', fontFamily: 'inherit', color: '#0A0A0A' }}
              />
            </div>

            {/* Terms & Privacy Acceptance */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px', background: 'rgba(10,10,10,0.02)', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.7)' }}>Terms & Privacy acceptance (admin only)</div>
              <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.5)' }}>No policy acceptance recorded yet.</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Status</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setEditForm({ ...editForm, status: 'active' })}
                  style={{
                    background: editForm.status === 'active' ? '#6B3FD1' : '#fff',
                    color: editForm.status === 'active' ? '#fff' : '#0A0A0A',
                    border: editForm.status === 'active' ? 'none' : '1px solid rgba(10,10,10,0.12)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Active
                </button>
                <button
                  onClick={() => setEditForm({ ...editForm, status: 'suspended' })}
                  style={{
                    background: editForm.status === 'suspended' ? '#0A0A0A' : '#fff',
                    color: editForm.status === 'suspended' ? '#fff' : '#0A0A0A',
                    border: editForm.status === 'suspended' ? 'none' : '1px solid rgba(10,10,10,0.12)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Suspended
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                onClick={() => setEditingUser(null)}
                style={{
                  flex: 1,
                  background: '#fff',
                  color: '#0A0A0A',
                  border: '1px solid rgba(10,10,10,0.12)',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                style={{
                  flex: 1,
                  background: '#0A0A0A',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', width: 'calc(100% - 32px)', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#0A0A0A' }}>Suspend this user?</div>
            <div style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)', lineHeight: '1.5' }}>
              They'll be signed out and unable to log in. Their profile and activity are kept and can be restored anytime.
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                style={{
                  flex: 1,
                  background: '#fff',
                  color: '#0A0A0A',
                  border: '1px solid rgba(10,10,10,0.12)',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                No
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteConfirm)}
                style={{
                  flex: 1,
                  background: '#3EE8A8',
                  color: '#0A0A0A',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
