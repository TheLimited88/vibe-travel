import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from '@/lib/firebase';

export async function ensureUserDoc(user: User, signupMethod: 'Email' | 'Google' | 'Apple'): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  const existing = await getDoc(userRef);
  if (existing.exists()) return;

  const [termsData, privacyData] = await Promise.all([
    fetch('/api/admin/content?key=terms').then((r) => r.json()).catch(() => null),
    fetch('/api/admin/content?key=privacy').then((r) => r.json()).catch(() => null),
  ]);
  const termsVersion = termsData?.versions?.length ? termsData.versions[termsData.versions.length - 1].version : null;
  const privacyVersion = privacyData?.versions?.length ? privacyData.versions[privacyData.versions.length - 1].version : null;

  const policyAcceptances = [
    ...(termsVersion ? [{ page: 'terms', version: termsVersion, acceptedAt: Date.now() }] : []),
    ...(privacyVersion ? [{ page: 'privacy', version: privacyVersion, acceptedAt: Date.now() }] : []),
  ];

  await setDoc(userRef, {
    email: user.email || '',
    name: user.displayName || '',
    emailVerified: user.emailVerified,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    savedPlaces: [],
    visitedPlaces: [],
    reviews: [],
    status: 'active',
    signupMethod,
    policyAcceptances,
  });
}
