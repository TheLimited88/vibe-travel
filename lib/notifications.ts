import { getAdminApp, getAdminDb } from '@/lib/firebaseAdmin';
import { getMessaging } from 'firebase-admin/messaging';
import type { PlaceRecord } from '@/lib/places';

const PREFS_COLLECTION = 'notificationPrefs';

export interface NotificationPrefs {
  uid: string;
  notifyNewPlaces: boolean;
  fcmToken: string | null;
  updatedAt: number;
}

export async function getNotificationPrefs(uid: string): Promise<NotificationPrefs | null> {
  const snap = await getAdminDb().collection(PREFS_COLLECTION).doc(uid).get();
  return snap.exists ? (snap.data() as NotificationPrefs) : null;
}

export async function setNotificationPrefs(
  uid: string,
  updates: Partial<Pick<NotificationPrefs, 'notifyNewPlaces' | 'fcmToken'>>
): Promise<void> {
  await getAdminDb()
    .collection(PREFS_COLLECTION)
    .doc(uid)
    .set({ uid, ...updates, updatedAt: Date.now() }, { merge: true });
}

/**
 * Sends a "new place published" push to everyone opted in. There's no
 * per-user location stored server-side to target true proximity, so this
 * notifies every opted-in user rather than pretending to filter by distance —
 * reasonable for a single-city (NYC) app, but not real geofencing.
 */
export async function notifyNewPlaceNearby(place: PlaceRecord): Promise<{ sent: number; failed: number }> {
  const db = getAdminDb();
  const snap = await db.collection(PREFS_COLLECTION).where('notifyNewPlaces', '==', true).get();

  const tokenDocs = snap.docs
    .map((d) => ({ ref: d.ref, token: (d.data() as NotificationPrefs).fcmToken }))
    .filter((d): d is { ref: FirebaseFirestore.DocumentReference; token: string } => !!d.token);

  if (tokenDocs.length === 0) return { sent: 0, failed: 0 };

  const messaging = getMessaging(getAdminApp());
  const response = await messaging.sendEachForMulticast({
    tokens: tokenDocs.map((d) => d.token),
    notification: {
      title: 'New place near you',
      body: `${place.title} — ${place.subtitle}`,
    },
    data: { placeSlug: place.slug },
  });

  // Clear out tokens FCM says are dead, so we stop retrying them forever.
  const deadRefs = response.responses
    .map((r, i) => (!r.success && isDeadTokenError(r.error?.code) ? tokenDocs[i].ref : null))
    .filter((ref): ref is FirebaseFirestore.DocumentReference => !!ref);

  if (deadRefs.length > 0) {
    const batch = db.batch();
    deadRefs.forEach((ref) => batch.update(ref, { fcmToken: null }));
    await batch.commit();
  }

  return { sent: response.successCount, failed: response.failureCount };
}

function isDeadTokenError(code?: string): boolean {
  return code === 'messaging/invalid-registration-token' || code === 'messaging/registration-token-not-registered';
}
