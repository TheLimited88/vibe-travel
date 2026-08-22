'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  signOut,
  linkWithCredential,
  unlink,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { linkWithPopupRetry } from '@/lib/auth';
import { useAuth } from '@/components/AuthProvider';
import { useDistanceUnit } from '@/components/DistanceUnitProvider';
import { requestFcmToken } from '@/lib/messaging';

interface SignInMethod {
  id: 'email' | 'google' | 'apple';
  label: string;
  providerId: string;
  glyph: string;
}

const SIGNIN_METHODS: SignInMethod[] = [
  { id: 'email', label: 'Email', providerId: 'password', glyph: '✉' },
  { id: 'google', label: 'Google', providerId: 'google.com', glyph: 'G' },
  { id: 'apple', label: 'Apple', providerId: 'apple.com', glyph: '' },
];

function passwordRules(pw: string) {
  return [
    { met: pw.length >= 8, label: 'At least 8 characters' },
    { met: /[A-Z]/.test(pw), label: 'One uppercase letter' },
    { met: /[0-9]/.test(pw), label: 'One number' },
  ];
}

function passwordMeetsRules(pw: string): boolean {
  return passwordRules(pw).every((r) => r.met);
}

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      {!open && <line x1="3" y1="21" x2="21" y2="3" stroke="currentColor" strokeWidth="1.6" />}
    </svg>
  );
}

function PasswordRulesChecklist({ password }: { password: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '2px 2px 0' }}>
      {passwordRules(password).map((rule) => (
        <div key={rule.label} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: rule.met ? '#0A9B71' : 'rgba(10,10,10,0.4)' }}>
          <span style={{ width: '15px', height: '15px', borderRadius: '999px', flexShrink: 0, border: `1.5px solid ${rule.met ? '#0A9B71' : 'rgba(10,10,10,0.35)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px' }}>
            {rule.met ? '✓' : ''}
          </span>
          {rule.label}
        </div>
      ))}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '18px',
  overflow: 'hidden',
  border: '1px solid rgba(10,10,10,0.06)',
  marginBottom: '16px',
};

const rowStyle: React.CSSProperties = {
  padding: '14px 16px',
  borderBottom: '1px solid rgba(10,10,10,0.07)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const sheetOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(10,10,10,0.45)',
  zIndex: 70,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
};

const sheetStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '375px',
  background: '#fff',
  borderRadius: '24px 24px 0 0',
  padding: '22px 20px 28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const pwInputStyle: React.CSSProperties = {
  flex: 1,
  width: '100%',
  border: '1px solid rgba(10,10,10,0.12)',
  borderRadius: '10px',
  padding: '11px 40px 11px 13px',
  fontSize: '14px',
  fontFamily: 'inherit',
  color: '#0A0A0A',
};

export default function AccountPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const isSignedIn = !!user;
  const { unit: distanceUnit, setUnit: setDistanceUnit } = useDistanceUnit();

  const [providerIds, setProviderIds] = useState<string[]>([]);
  const [newPlacesNearby, setNewPlacesNearby] = useState(false);
  const [savingNewPlaces, setSavingNewPlaces] = useState(false);
  const [geofencePrompts, setGeofencePrompts] = useState(false);
  const [savingGeofencePrompts, setSavingGeofencePrompts] = useState(false);

  // Sign-in method sheet
  const [signInSheetOpen, setSignInSheetOpen] = useState(false);
  const [linkingProvider, setLinkingProvider] = useState<string | null>(null);
  const [linkError, setLinkError] = useState('');
  const [confirmingUnlink, setConfirmingUnlink] = useState<string | null>(null);
  const [unlinkError, setUnlinkError] = useState('');

  // Add email & password (nested inside the sign-in sheet)
  const [addPasswordOpen, setAddPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Change password sheet
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [changeNewPassword, setChangeNewPassword] = useState('');
  const [changeConfirmPassword, setChangeConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showChangeNewPassword, setShowChangeNewPassword] = useState(false);
  const [showChangeConfirmPassword, setShowChangeConfirmPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState('');
  const [savingChangePassword, setSavingChangePassword] = useState(false);
  const [toast, setToast] = useState('');

  const userInfo = {
    name: user?.displayName || 'there',
    email: user?.email || '',
  };

  useEffect(() => {
    setProviderIds(user?.providerData.map((p) => p.providerId) || []);
  }, [user]);

  // Linking/unlinking mutate the existing Firebase user object in place —
  // onAuthStateChanged doesn't re-fire for that (the signed-in user hasn't
  // changed), so without this the row would keep showing the old state until
  // a full reload.
  const refreshProviderIds = async () => {
    if (!auth.currentUser) return;
    await auth.currentUser.reload();
    setProviderIds(auth.currentUser.providerData.map((p) => p.providerId));
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 2500);
  };

  const methodRows = SIGNIN_METHODS.map((m) => {
    const linked = providerIds.includes(m.providerId);
    return {
      ...m,
      linked,
      sub: linked
        ? m.id === 'email'
          ? `${userInfo.email} · password`
          : `${m.label} account · ${userInfo.email}`
        : 'Not connected',
    };
  });

  const primaryMethod = methodRows.find((m) => m.linked) || methodRows[0];

  const resetAddPasswordForm = () => {
    setAddPasswordOpen(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleAddPassword = async () => {
    if (!user || !user.email) return;
    if (!passwordMeetsRules(newPassword)) {
      setPasswordError('Password does not meet the requirements.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match.");
      return;
    }
    setSavingPassword(true);
    setPasswordError('');
    try {
      await linkWithCredential(user, EmailAuthProvider.credential(user.email, newPassword));
      await refreshProviderIds();
      resetAddPasswordForm();
      showToast('Now signing in with email and password');
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (code === 'auth/requires-recent-login') {
        setPasswordError('For security, please sign out and back in, then try again.');
      } else if (code === 'auth/email-already-in-use' || code === 'auth/credential-already-in-use') {
        setPasswordError('This email already has a password on another account.');
      } else {
        setPasswordError('Could not add a password. Please try again.');
      }
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLinkOAuth = async (method: SignInMethod) => {
    if (!user) return;
    setLinkingProvider(method.providerId);
    setLinkError('');
    try {
      const provider = method.id === 'google' ? new GoogleAuthProvider() : new OAuthProvider('apple.com');
      await linkWithPopupRetry(user, provider);
      await refreshProviderIds();
      showToast(`Now signing in with ${method.label}`);
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // User backed out — not an error worth surfacing.
      } else if (code === 'auth/credential-already-in-use') {
        setLinkError(`That ${method.label} account is already linked to a different user.`);
      } else {
        setLinkError(`Could not connect ${method.label}. Please try again.`);
      }
    } finally {
      setLinkingProvider(null);
    }
  };

  const handleMethodRowClick = (method: (typeof methodRows)[number]) => {
    if (method.linked) {
      if (providerIds.length > 1) {
        setConfirmingUnlink(method.providerId);
        setUnlinkError('');
      }
      return;
    }
    if (method.id === 'email') {
      setAddPasswordOpen(true);
      setPasswordError('');
      return;
    }
    handleLinkOAuth(method);
  };

  const handleUnlinkProvider = async (providerId: string) => {
    if (!user) return;
    setUnlinkError('');
    try {
      await unlink(user, providerId);
      await refreshProviderIds();
      setConfirmingUnlink(null);
    } catch (error) {
      const code = (error as { code?: string }).code;
      setUnlinkError(
        code === 'auth/requires-recent-login'
          ? 'For security, please sign out and back in, then try again.'
          : 'Could not remove this sign-in method. Please try again.'
      );
    }
  };

  const closeSignInSheet = () => {
    setSignInSheetOpen(false);
    resetAddPasswordForm();
    setConfirmingUnlink(null);
    setUnlinkError('');
    setLinkError('');
  };

  const resetChangePasswordForm = () => {
    setChangePasswordOpen(false);
    setCurrentPassword('');
    setChangeNewPassword('');
    setChangeConfirmPassword('');
    setChangePasswordError('');
    setShowCurrentPassword(false);
    setShowChangeNewPassword(false);
    setShowChangeConfirmPassword(false);
  };

  const handleChangePassword = async () => {
    if (!user || !user.email) return;
    if (!currentPassword) {
      setChangePasswordError('Enter your current password.');
      return;
    }
    if (!passwordMeetsRules(changeNewPassword)) {
      setChangePasswordError('New password does not meet the requirements.');
      return;
    }
    if (changeNewPassword !== changeConfirmPassword) {
      setChangePasswordError("Passwords don't match.");
      return;
    }
    setSavingChangePassword(true);
    setChangePasswordError('');
    try {
      // Re-authenticate with the current password first — Firebase requires
      // a recent login to change a password, and this doubles as proof the
      // person doing it actually knows the current one.
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, currentPassword));
      await updatePassword(user, changeNewPassword);
      resetChangePasswordForm();
      showToast('Password updated');
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setChangePasswordError('Current password is incorrect.');
      } else if (code === 'auth/too-many-requests') {
        setChangePasswordError('Too many attempts. Please try again later.');
      } else {
        setChangePasswordError('Could not change password. Please try again.');
      }
    } finally {
      setSavingChangePassword(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    user.getIdToken().then((token) => {
      fetch('/api/account/notification-prefs', { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((data) => {
          setNewPlacesNearby(!!data.notifyNewPlaces);
          setGeofencePrompts(!!data.notifyGeofenceArrival);
        })
        .catch(() => {});
    });
  }, [user]);

  const toggleNotificationPref = async (
    prefKey: 'notifyNewPlaces' | 'notifyGeofenceArrival',
    current: boolean,
    apply: (next: boolean) => void
  ) => {
    if (!user) return;
    const next = !current;
    if (next) {
      if (typeof Notification !== 'undefined' && Notification.permission === 'denied') return;
      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;
      }
      const fcmToken = await requestFcmToken();
      const token = await user.getIdToken();
      await fetch('/api/account/notification-prefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ [prefKey]: true, fcmToken }),
      });
    } else {
      const token = await user.getIdToken();
      await fetch('/api/account/notification-prefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ [prefKey]: false }),
      });
    }
    apply(next);
  };

  const handleToggleNewPlaces = async () => {
    if (savingNewPlaces) return;
    setSavingNewPlaces(true);
    try {
      await toggleNotificationPref('notifyNewPlaces', newPlacesNearby, setNewPlacesNearby);
    } finally {
      setSavingNewPlaces(false);
    }
  };

  const handleToggleGeofencePrompts = async () => {
    if (savingGeofencePrompts) return;
    setSavingGeofencePrompts(true);
    try {
      await toggleNotificationPref('notifyGeofenceArrival', geofencePrompts, setGeofencePrompts);
    } finally {
      setSavingGeofencePrompts(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#F4F2F8' }}>
      <div style={{ width: '100%', maxWidth: '375px', display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
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
              {/* Profile Card */}
              <div style={cardStyle}>
                <div style={rowStyle}>
                  <span style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>Name</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#0A0A0A' }}>{userInfo.name}</span>
                </div>
                <div style={rowStyle}>
                  <span style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>Email</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#0A0A0A' }}>{userInfo.email}</span>
                </div>
                <button
                  onClick={() => setSignInSheetOpen(true)}
                  style={{ ...rowStyle, width: '100%', background: 'none', border: 'none', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>Sign-in method</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <span style={{ width: '20px', height: '20px', borderRadius: '999px', background: 'rgba(10,10,10,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', color: '#0A0A0A' }}>
                      {primaryMethod.glyph}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#0A0A0A' }}>{primaryMethod.label}</span>
                    <span style={{ color: 'rgba(10,10,10,0.3)' }}>›</span>
                  </span>
                </button>
                {providerIds.includes('password') && (
                  <button
                    onClick={() => setChangePasswordOpen(true)}
                    style={{ ...rowStyle, width: '100%', background: 'none', border: 'none', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}
                  >
                    <span style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>Password</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#0A0A0A', letterSpacing: '2px' }}>••••••••</span>
                      <span style={{ color: 'rgba(10,10,10,0.3)' }}>›</span>
                    </span>
                  </button>
                )}
                <div style={{ ...rowStyle, borderBottom: 'none' }}>
                  <span style={{ fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>Distance unit</span>
                  <div style={{ display: 'flex', background: 'rgba(10,10,10,0.05)', borderRadius: '999px', padding: '3px' }}>
                    <button
                      onClick={() => setDistanceUnit('mi')}
                      style={{
                        background: distanceUnit === 'mi' ? '#fff' : 'transparent',
                        boxShadow: distanceUnit === 'mi' ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: distanceUnit === 'mi' ? '700' : '500',
                        color: '#0A0A0A',
                        cursor: 'pointer',
                      }}
                    >
                      mi
                    </button>
                    <button
                      onClick={() => setDistanceUnit('km')}
                      style={{
                        background: distanceUnit === 'km' ? '#fff' : 'transparent',
                        boxShadow: distanceUnit === 'km' ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: distanceUnit === 'km' ? '700' : '500',
                        color: '#0A0A0A',
                        cursor: 'pointer',
                      }}
                    >
                      km
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications Card */}
              <div style={cardStyle}>
                <div style={{ padding: '14px 16px 4px', fontSize: '11px', fontWeight: '700', color: 'rgba(10,10,10,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Notifications
                </div>
                <div style={{ ...rowStyle, padding: '10px 16px' }}>
                  <span style={{ fontSize: '13.5px', color: '#0A0A0A' }}>New Places nearby</span>
                  <button
                    onClick={handleToggleNewPlaces}
                    disabled={savingNewPlaces}
                    style={{
                      background: newPlacesNearby ? '#6B3FD1' : 'rgba(10,10,10,0.2)',
                      border: 'none',
                      borderRadius: '999px',
                      width: '44px',
                      height: '24px',
                      cursor: savingNewPlaces ? 'default' : 'pointer',
                      opacity: savingNewPlaces ? 0.6 : 1,
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
                <div style={{ ...rowStyle, padding: '10px 16px', borderBottom: 'none' }}>
                  <span style={{ fontSize: '13.5px', color: '#0A0A0A' }}>Geofence arrival prompts</span>
                  <button
                    onClick={handleToggleGeofencePrompts}
                    disabled={savingGeofencePrompts}
                    style={{
                      background: geofencePrompts ? '#6B3FD1' : 'rgba(10,10,10,0.2)',
                      border: 'none',
                      borderRadius: '999px',
                      width: '44px',
                      height: '24px',
                      cursor: savingGeofencePrompts ? 'default' : 'pointer',
                      opacity: savingGeofencePrompts ? 0.6 : 1,
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

              {/* Navigation Card */}
              <div style={cardStyle}>
                <button
                  onClick={() => router.push('/saved')}
                  style={{ ...rowStyle, width: '100%', background: 'none', border: 'none', font: 'inherit', cursor: 'pointer', color: '#0A0A0A', fontSize: '14px' }}
                >
                  Saved Places
                  <span style={{ fontSize: '20px', color: 'rgba(10,10,10,0.3)' }}>›</span>
                </button>
                <button
                  onClick={() => router.push('/visited')}
                  style={{ ...rowStyle, borderBottom: 'none', width: '100%', background: 'none', border: 'none', font: 'inherit', cursor: 'pointer', color: '#0A0A0A', fontSize: '14px' }}
                >
                  Visited Places
                  <span style={{ fontSize: '20px', color: 'rgba(10,10,10,0.3)' }}>›</span>
                </button>
              </div>

              {/* Actions Card */}
              <div style={{ ...cardStyle, padding: '8px 0' }}>
                <button
                  onClick={handleSignOut}
                  style={{
                    width: '100%',
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
                    width: '100%',
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

        {/* Sign-in Method Sheet */}
        {signInSheetOpen && (
          <div onClick={closeSignInSheet} style={sheetOverlayStyle}>
            <div onClick={(e) => e.stopPropagation()} style={{ ...sheetStyle, gap: addPasswordOpen ? '12px' : '6px' }}>
              {!addPasswordOpen ? (
                <>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#0A0A0A' }}>Sign-in method</div>
                  <div style={{ fontSize: '12.5px', color: 'rgba(10,10,10,0.6)', lineHeight: '1.5', paddingBottom: '8px' }}>
                    Signed in with {primaryMethod.label} as {userInfo.email}. Switch to another method — your saved and visited places stay with this account.
                  </div>
                  {methodRows.map((m) => (
                    <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <button
                        onClick={() => handleMethodRowClick(m)}
                        disabled={linkingProvider === m.providerId}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          width: '100%',
                          textAlign: 'left',
                          font: 'inherit',
                          cursor: linkingProvider === m.providerId ? 'default' : 'pointer',
                          padding: '12px 14px',
                          borderRadius: '14px',
                          border: `1px solid ${m.linked ? '#3EE8A8' : 'rgba(10,10,10,0.1)'}`,
                          background: m.linked ? 'rgba(62,232,168,0.1)' : '#fff',
                          opacity: linkingProvider === m.providerId ? 0.6 : 1,
                        }}
                      >
                        <span style={{ width: '32px', height: '32px', flexShrink: 0, borderRadius: '999px', background: 'rgba(10,10,10,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', color: '#0A0A0A' }}>
                          {m.glyph}
                        </span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#0A0A0A' }}>{m.label}</span>
                          <span style={{ fontSize: '11.5px', color: 'rgba(10,10,10,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {linkingProvider === m.providerId ? 'Connecting…' : m.sub}
                          </span>
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#0A9B71', opacity: m.linked ? 1 : 0 }}>✓</span>
                      </button>
                      {confirmingUnlink === m.providerId && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 4px' }}>
                          <span style={{ fontSize: '12.5px', color: 'rgba(10,10,10,0.6)' }}>Remove {m.label} sign-in?</span>
                          <button
                            onClick={() => handleUnlinkProvider(m.providerId)}
                            style={{ background: 'none', border: 'none', padding: 0, color: '#D14545', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}
                          >
                            Yes, remove
                          </button>
                          <button
                            onClick={() => { setConfirmingUnlink(null); setUnlinkError(''); }}
                            style={{ background: 'none', border: 'none', padding: 0, color: 'rgba(10,10,10,0.5)', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {linkError && <div style={{ fontSize: '12px', color: '#D14545' }}>{linkError}</div>}
                  {unlinkError && <div style={{ fontSize: '12px', color: '#D14545' }}>{unlinkError}</div>}
                  <button
                    onClick={closeSignInSheet}
                    style={{ background: 'none', border: 'none', color: 'rgba(10,10,10,0.5)', fontSize: '12.5px', fontWeight: '600', padding: '10px', marginTop: '4px' }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#0A0A0A' }}>Add email &amp; password</div>
                  <div style={{ fontSize: '12.5px', color: 'rgba(10,10,10,0.6)', lineHeight: '1.5' }}>
                    Set a password for {userInfo.email} so you can also sign in with email.
                  </div>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.55)' }}>New password</span>
                    <div style={{ position: 'relative', display: 'flex' }}>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setPasswordError(''); }}
                        placeholder="••••••••"
                        style={pwInputStyle}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((v) => !v)}
                        aria-label="Toggle password visibility"
                        style={{ position: 'absolute', right: '6px', top: 0, bottom: 0, background: 'none', border: 'none', padding: 0, width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(10,10,10,0.45)', cursor: 'pointer' }}
                      >
                        <EyeIcon open={showNewPassword} />
                      </button>
                    </div>
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.55)' }}>Confirm password</span>
                    <div style={{ position: 'relative', display: 'flex' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(''); }}
                        placeholder="••••••••"
                        style={pwInputStyle}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        aria-label="Toggle password visibility"
                        style={{ position: 'absolute', right: '6px', top: 0, bottom: 0, background: 'none', border: 'none', padding: 0, width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(10,10,10,0.45)', cursor: 'pointer' }}
                      >
                        <EyeIcon open={showConfirmPassword} />
                      </button>
                    </div>
                  </label>
                  <PasswordRulesChecklist password={newPassword} />
                  {!!confirmPassword && newPassword !== confirmPassword && (
                    <div style={{ fontSize: '12px', color: '#D14545' }}>Passwords don&apos;t match.</div>
                  )}
                  {passwordError && <div style={{ fontSize: '12px', color: '#D14545' }}>{passwordError}</div>}
                  <button
                    onClick={handleAddPassword}
                    disabled={savingPassword}
                    style={{ background: '#3EE8A8', color: '#0A0A0A', border: 'none', borderRadius: '14px', padding: '13px', fontSize: '14px', fontWeight: '700', marginTop: '4px', cursor: savingPassword ? 'default' : 'pointer', opacity: savingPassword ? 0.6 : 1 }}
                  >
                    {savingPassword ? 'Saving…' : 'Save password'}
                  </button>
                  <button
                    onClick={resetAddPasswordForm}
                    style={{ background: 'none', border: 'none', color: 'rgba(10,10,10,0.5)', fontSize: '12.5px', fontWeight: '600', padding: '4px' }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Change Password Sheet */}
        {changePasswordOpen && (
          <div onClick={resetChangePasswordForm} style={sheetOverlayStyle}>
            <div onClick={(e) => e.stopPropagation()} style={sheetStyle}>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#0A0A0A' }}>Change password</div>
              <div style={{ fontSize: '12.5px', color: 'rgba(10,10,10,0.6)', lineHeight: '1.5' }}>
                Choose a new password for {userInfo.email}.
              </div>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.55)' }}>Current password</span>
                <div style={{ position: 'relative', display: 'flex' }}>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => { setCurrentPassword(e.target.value); setChangePasswordError(''); }}
                    placeholder="••••••••"
                    style={pwInputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((v) => !v)}
                    aria-label="Toggle password visibility"
                    style={{ position: 'absolute', right: '6px', top: 0, bottom: 0, background: 'none', border: 'none', padding: 0, width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(10,10,10,0.45)', cursor: 'pointer' }}
                  >
                    <EyeIcon open={showCurrentPassword} />
                  </button>
                </div>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.55)' }}>New password</span>
                <div style={{ position: 'relative', display: 'flex' }}>
                  <input
                    type={showChangeNewPassword ? 'text' : 'password'}
                    value={changeNewPassword}
                    onChange={(e) => { setChangeNewPassword(e.target.value); setChangePasswordError(''); }}
                    placeholder="••••••••"
                    style={pwInputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowChangeNewPassword((v) => !v)}
                    aria-label="Toggle password visibility"
                    style={{ position: 'absolute', right: '6px', top: 0, bottom: 0, background: 'none', border: 'none', padding: 0, width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(10,10,10,0.45)', cursor: 'pointer' }}
                  >
                    <EyeIcon open={showChangeNewPassword} />
                  </button>
                </div>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(10,10,10,0.55)' }}>Confirm new password</span>
                <div style={{ position: 'relative', display: 'flex' }}>
                  <input
                    type={showChangeConfirmPassword ? 'text' : 'password'}
                    value={changeConfirmPassword}
                    onChange={(e) => { setChangeConfirmPassword(e.target.value); setChangePasswordError(''); }}
                    placeholder="••••••••"
                    style={pwInputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowChangeConfirmPassword((v) => !v)}
                    aria-label="Toggle password visibility"
                    style={{ position: 'absolute', right: '6px', top: 0, bottom: 0, background: 'none', border: 'none', padding: 0, width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(10,10,10,0.45)', cursor: 'pointer' }}
                  >
                    <EyeIcon open={showChangeConfirmPassword} />
                  </button>
                </div>
              </label>
              <PasswordRulesChecklist password={changeNewPassword} />
              {!!changeConfirmPassword && changeNewPassword !== changeConfirmPassword && (
                <div style={{ fontSize: '12px', color: '#D14545' }}>Passwords don&apos;t match.</div>
              )}
              {changePasswordError && <div style={{ fontSize: '12px', color: '#D14545' }}>{changePasswordError}</div>}
              <button
                onClick={handleChangePassword}
                disabled={savingChangePassword}
                style={{ background: '#3EE8A8', color: '#0A0A0A', border: 'none', borderRadius: '14px', padding: '13px', fontSize: '14px', fontWeight: '700', marginTop: '4px', cursor: savingChangePassword ? 'default' : 'pointer', opacity: savingChangePassword ? 0.6 : 1 }}
              >
                {savingChangePassword ? 'Saving…' : 'Update password'}
              </button>
              <button
                onClick={resetChangePasswordForm}
                style={{ background: 'none', border: 'none', color: 'rgba(10,10,10,0.5)', fontSize: '12.5px', fontWeight: '600', padding: '4px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {toast && (
          <div style={{
            position: 'fixed',
            bottom: '90px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#0A0A0A',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 600,
            zIndex: 80,
            maxWidth: '90%',
            textAlign: 'center',
          }}>
            {toast}
          </div>
        )}

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
