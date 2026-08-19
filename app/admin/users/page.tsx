'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PolicyAcceptance {
  page: 'terms' | 'privacy';
  version: string;
  acceptedAt: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  savedCount: number;
  visitedCount: number;
  signupMethod: string;
  status: 'active' | 'suspended';
  policyAcceptances: PolicyAcceptance[];
}

const PAGE_LABELS: Record<string, string> = { terms: 'Terms of Service', privacy: 'Privacy Policy' };

function formatDate(timestamp: number): string {
  if (!timestamp) return '—';
  return new Date(timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function initialsOf(name: string, email: string): string {
  if (name.trim()) {
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] || parts[0][1] || '')).toUpperCase().slice(0, 2);
  }
  return email.slice(0, 2).toUpperCase();
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', status: 'active' as 'active' | 'suspended' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
    setLoading(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditForm({ name: user.name, status: user.status });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingUser.id, name: editForm.name, status: editForm.status }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, name: editForm.name, status: editForm.status } : u)));
        setEditingUser(null);
        setToast('User updated');
      } else {
        setToast(data.error || 'Update failed');
      }
    } catch (error) {
      setToast('Network error — update failed');
    }
    setSaving(false);
    setTimeout(() => setToast(''), 2500);
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, status: 'suspended' }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'suspended' } : u)));
        setToast('User suspended');
      } else {
        setToast(data.error || 'Suspend failed');
      }
    } catch (error) {
      setToast('Network error — suspend failed');
    }
    setShowDeleteConfirm(null);
    setTimeout(() => setToast(''), 2500);
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
          <button onClick={() => router.push('/admin/places')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: 0 }}>‹</button>
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
            {loading ? (
              <div style={{ padding: '40px 0', textAlign: 'center', fontSize: '13px', color: 'rgba(10,10,10,0.5)' }}>Loading…</div>
            ) : filteredUsers.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', fontSize: '13px', color: 'rgba(10,10,10,0.5)' }}>
                {users.length === 0 ? 'No users have signed up yet.' : 'No users match your search.'}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} style={{ background: '#fff', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '12px', padding: '12px', display: 'flex', gap: '12px' }}>
                  {/* Avatar */}
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '999px',
                      background: '#6B3FD1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: '700',
                      fontSize: '14px',
                      flexShrink: 0,
                    }}
                  >
                    {initialsOf(user.name, user.email)}
                  </div>

                  {/* User Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0A0A0A' }}>{user.name || '(No name set)'}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.6)', marginTop: '2px' }}>{user.email}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.5)', marginTop: '4px' }}>
                      Joined {formatDate(user.createdAt)} · {user.savedCount} saved · {user.visitedCount} visited
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
                      aria-label="Edit user"
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
                    {user.status === 'active' && (
                      <button
                        onClick={() => setShowDeleteConfirm(user.id)}
                        aria-label="Suspend user"
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
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Admin Bottom Navigation */}
        <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(10,10,10,0.07)', display: 'flex', padding: '8px 6px 24px', flexShrink: 0, gap: 0, justifyContent: 'space-around', zIndex: 30 }}>
          <button onClick={() => router.push('/admin/places')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.4 7-12.5C19 5.4 15.9 2 12 2S5 5.4 5 9.5C5 14.6 12 22 12 22z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="9.5" r="2.6" stroke="currentColor" strokeWidth="1.8"/></svg>
            <span>Places</span>
          </button>
          <button onClick={() => router.push('/admin/content')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l11-11-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.8"/></svg>
            <span>Content</span>
          </button>
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: '#6B3FD1', background: 'none', border: 'none', cursor: 'not-allowed', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.3" stroke="currentColor" strokeWidth="1.8"/><path d="M2.5 20c1.2-3.6 3.8-5.4 6.5-5.4s5.3 1.8 6.5 5.4" stroke="currentColor" strokeWidth="1.8"/><circle cx="17.5" cy="8.5" r="2.6" stroke="currentColor" strokeWidth="1.6"/><path d="M15.5 14.6c2.2.3 4 1.8 5 4.9" stroke="currentColor" strokeWidth="1.6"/></svg>
            <span>Users</span>
          </button>
          <button onClick={() => router.push('/admin/account')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '600', color: 'rgba(10,10,10,0.6)', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8"/></svg>
            <span>Account</span>
          </button>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '375px', padding: '24px 16px 32px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#0A0A0A' }}>Edit user</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Name</label>
              <input
                type="text"
                placeholder="No name set"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                style={{ border: '1px solid rgba(10,10,10,0.12)', borderRadius: '12px', padding: '12px', fontSize: '14px', fontFamily: 'inherit', color: '#0A0A0A' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.6)' }}>Email</label>
              <input
                type="email"
                value={editingUser.email}
                disabled
                style={{ border: '1px solid rgba(10,10,10,0.12)', borderRadius: '12px', padding: '12px', fontSize: '14px', fontFamily: 'inherit', color: 'rgba(10,10,10,0.5)', background: 'rgba(10,10,10,0.03)' }}
              />
              <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.45)' }}>Email is the user's login identity and can't be changed here.</span>
            </div>

            {/* Terms & Privacy Acceptance */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px', background: 'rgba(10,10,10,0.02)', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.7)' }}>Terms & Privacy acceptance (admin only)</div>
              {editingUser.policyAcceptances.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.5)' }}>No policy acceptance recorded yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '160px', overflowY: 'auto' }}>
                  {editingUser.policyAcceptances.map((acceptance, idx) => (
                    <button
                      key={idx}
                      onClick={() => router.push(`/admin/content?tab=${acceptance.page}&version=${encodeURIComponent(acceptance.version)}`)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '8px 6px', background: 'none', border: 'none', borderBottom: idx < editingUser.policyAcceptances.length - 1 ? '1px solid rgba(10,10,10,0.06)' : 'none', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}
                    >
                      <span style={{ fontSize: '12.5px', color: 'rgba(10,10,10,0.75)' }}>{PAGE_LABELS[acceptance.page]} · Accepted {formatDate(acceptance.acceptedAt)}</span>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#6B3FD1', flexShrink: 0 }}>{acceptance.version} ›</span>
                    </button>
                  ))}
                </div>
              )}
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
                disabled={saving}
                style={{
                  flex: 1,
                  background: '#fff',
                  color: '#0A0A0A',
                  border: '1px solid rgba(10,10,10,0.12)',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                style={{
                  flex: 1,
                  background: '#0A0A0A',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation Modal */}
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
                onClick={() => handleSuspendUser(showDeleteConfirm)}
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

      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: '#0A0A0A', color: '#fff', fontSize: '13px', fontWeight: '600', padding: '12px 20px', borderRadius: '999px', boxShadow: '0 6px 20px rgba(0,0,0,0.25)', zIndex: 999 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
