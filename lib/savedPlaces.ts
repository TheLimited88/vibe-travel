import { getAdminDb } from '@/lib/firebaseAdmin';

const SAVED_COLLECTION = 'savedPlaces';

function docId(uid: string, placeSlug: string): string {
  return `${uid}_${placeSlug}`;
}

export interface SavedPlace {
  uid: string;
  placeSlug: string;
  savedAt: number;
}

export async function isSaved(uid: string, placeSlug: string): Promise<boolean> {
  const snap = await getAdminDb().collection(SAVED_COLLECTION).doc(docId(uid, placeSlug)).get();
  return snap.exists;
}

/**
 * Toggles the save state for this user+place. Returns the new state.
 */
export async function toggleSave(uid: string, placeSlug: string): Promise<boolean> {
  const ref = getAdminDb().collection(SAVED_COLLECTION).doc(docId(uid, placeSlug));

  return getAdminDb().runTransaction(async (tx) => {
    const existing = await tx.get(ref);
    if (existing.exists) {
      tx.delete(ref);
      return false;
    }
    const record: SavedPlace = { uid, placeSlug, savedAt: Date.now() };
    tx.set(ref, record);
    return true;
  });
}

export async function getSaveCount(placeSlug: string): Promise<number> {
  const snap = await getAdminDb().collection(SAVED_COLLECTION).where('placeSlug', '==', placeSlug).count().get();
  return snap.data().count;
}

export async function listSavedForUser(uid: string): Promise<SavedPlace[]> {
  const snap = await getAdminDb().collection(SAVED_COLLECTION).where('uid', '==', uid).get();
  return snap.docs.map((d) => d.data() as SavedPlace);
}
