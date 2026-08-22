import { getAdminDb } from '@/lib/firebaseAdmin';
import { getContentVersions } from '@/lib/contentPages';

export const POLICY_PAGES = ['terms', 'privacy'] as const;
export type PolicyPage = (typeof POLICY_PAGES)[number];

interface PolicyAcceptance {
  page: string;
  version: string;
  acceptedAt: number;
}

export interface PolicyStatus {
  outdated: Record<PolicyPage, boolean>;
  versions: Record<PolicyPage, string | null>;
}

async function latestVersion(key: PolicyPage): Promise<string | null> {
  const versions = await getContentVersions(key);
  return versions.length ? versions[versions.length - 1].version : null;
}

export async function getPolicyStatus(uid: string): Promise<PolicyStatus> {
  const [termsVersion, privacyVersion, userSnap] = await Promise.all([
    latestVersion('terms'),
    latestVersion('privacy'),
    getAdminDb().collection('users').doc(uid).get(),
  ]);

  const acceptances: PolicyAcceptance[] = userSnap.exists
    ? (userSnap.data()?.policyAcceptances as PolicyAcceptance[] | undefined) || []
    : [];
  const acceptedVersion = (page: PolicyPage) => acceptances.find((a) => a.page === page)?.version ?? null;

  return {
    outdated: {
      terms: !!termsVersion && acceptedVersion('terms') !== termsVersion,
      privacy: !!privacyVersion && acceptedVersion('privacy') !== privacyVersion,
    },
    versions: { terms: termsVersion, privacy: privacyVersion },
  };
}

export async function acceptPolicies(uid: string, pages: PolicyPage[]): Promise<void> {
  const db = getAdminDb();
  const userRef = db.collection('users').doc(uid);
  const [snap, ...versions] = await Promise.all([userRef.get(), ...pages.map(latestVersion)]);

  const existing: PolicyAcceptance[] = snap.exists
    ? (snap.data()?.policyAcceptances as PolicyAcceptance[] | undefined) || []
    : [];
  const now = Date.now();
  const updated = existing.filter((a) => !pages.includes(a.page as PolicyPage));
  pages.forEach((page, i) => {
    const version = versions[i];
    if (version) updated.push({ page, version, acceptedAt: now });
  });

  await userRef.set({ policyAcceptances: updated }, { merge: true });
}
