import { getAdminDb } from '@/lib/firebaseAdmin';

export interface ContentSection {
  id: number;
  type: 'header' | 'text' | 'youtube';
  content: string;
}

export interface ContentPageData {
  sections: ContentSection[];
  updatedAt: number | null;
}

export const CONTENT_PAGE_KEYS = ['about', 'help', 'terms', 'privacy', 'acceptable_use', 'cookies'];

const COLLECTION = 'contentPages';

export async function getContentPage(key: string): Promise<ContentPageData> {
  const snap = await getAdminDb().collection(COLLECTION).doc(key).get();
  if (!snap.exists) return { sections: [], updatedAt: null };
  const data = snap.data() as { sections?: ContentSection[]; updatedAt?: number };
  return { sections: data.sections || [], updatedAt: data.updatedAt || null };
}

export async function setContentPage(key: string, sections: ContentSection[]): Promise<number> {
  const updatedAt = Date.now();
  await getAdminDb().collection(COLLECTION).doc(key).set({ sections, updatedAt }, { merge: true });
  return updatedAt;
}
