import { getAdminDb } from '@/lib/firebaseAdmin';

export interface AdminProfile {
  photoUrl: string | null;
  photoKey: string | null;
}

const SETTINGS_COLLECTION = 'adminSettings';
const PROFILE_DOC = 'profile';

export async function getAdminProfile(): Promise<AdminProfile> {
  const snap = await getAdminDb().collection(SETTINGS_COLLECTION).doc(PROFILE_DOC).get();
  if (!snap.exists) return { photoUrl: null, photoKey: null };
  const data = snap.data() as Partial<AdminProfile>;
  return { photoUrl: data.photoUrl || null, photoKey: data.photoKey || null };
}

export async function setAdminProfile(photoUrl: string | null, photoKey: string | null): Promise<void> {
  await getAdminDb().collection(SETTINGS_COLLECTION).doc(PROFILE_DOC).set({ photoUrl, photoKey }, { merge: true });
}
