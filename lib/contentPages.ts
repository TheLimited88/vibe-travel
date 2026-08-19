import { getAdminDb } from '@/lib/firebaseAdmin';

export interface ContentSection {
  id: number;
  type: 'header' | 'text' | 'youtube';
  content: string;
}

export interface ContentVersion {
  version: string;
  publishedDate: string;
  sections: ContentSection[];
  createdAt: number;
}

export const CONTENT_PAGE_KEYS = ['about', 'help', 'terms', 'privacy', 'acceptable_use', 'cookies'];

const COLLECTION = 'contentPages';

export async function getContentVersions(key: string): Promise<ContentVersion[]> {
  const snap = await getAdminDb().collection(COLLECTION).doc(key).get();
  if (!snap.exists) return [];
  const data = snap.data() as { versions?: ContentVersion[] };
  return data.versions || [];
}

function nextVersionNumber(last: ContentVersion | undefined): string {
  if (!last) return 'v1.0';
  const [maj, min] = last.version.slice(1).split('.').map(Number);
  return `v${maj}.${min + 1}`;
}

export async function saveContentVersion(key: string, sections: ContentSection[]): Promise<ContentVersion> {
  const docRef = getAdminDb().collection(COLLECTION).doc(key);
  const snap = await docRef.get();
  const existing: ContentVersion[] = snap.exists ? (snap.data() as { versions?: ContentVersion[] }).versions || [] : [];
  const now = Date.now();
  const newVersion: ContentVersion = {
    version: nextVersionNumber(existing[existing.length - 1]),
    publishedDate: new Date(now).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
    sections,
    createdAt: now,
  };
  await docRef.set({ versions: [...existing, newVersion] }, { merge: true });
  return newVersion;
}
