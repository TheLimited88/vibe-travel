import { getAdminApp, getAdminDb } from '@/lib/firebaseAdmin';
import { getMessaging } from 'firebase-admin/messaging';
import { listPlaces } from '@/lib/places';
import { getArrivalCount, getReviewSummary } from '@/lib/placeReviews';
import { haversineMi } from '@/lib/geo';

const PREFS_COLLECTION = 'notificationPrefs';
const SENT_COLLECTION = 'sentPlaceNotifications';

const NEW_PLACE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const NEARBY_RADIUS_MI = 0.75;

export interface NotificationPrefs {
  uid: string;
  notifyNewPlaces: boolean;
  notifyGeofenceArrival: boolean;
  fcmToken: string | null;
  updatedAt: number;
}

export async function getNotificationPrefs(uid: string): Promise<NotificationPrefs | null> {
  const snap = await getAdminDb().collection(PREFS_COLLECTION).doc(uid).get();
  return snap.exists ? (snap.data() as NotificationPrefs) : null;
}

export async function setNotificationPrefs(
  uid: string,
  updates: Partial<Pick<NotificationPrefs, 'notifyNewPlaces' | 'notifyGeofenceArrival' | 'fcmToken'>>
): Promise<void> {
  await getAdminDb()
    .collection(PREFS_COLLECTION)
    .doc(uid)
    .set({ uid, ...updates, updatedAt: Date.now() }, { merge: true });
}

/**
 * Sends a "you've arrived" push to this user's own registered device —
 * called once the client (geofenceService's continuous location watch, or
 * PlaceDirections' one-shot check on returning to the tab) has already
 * decided a real arrival happened. This only re-checks the user's own
 * opt-in and owns the actual send; it never takes a token from the caller.
 */
export async function sendArrivalPush(uid: string, placeName: string): Promise<{ sent: boolean }> {
  const prefs = await getNotificationPrefs(uid);
  if (!prefs?.notifyGeofenceArrival || !prefs.fcmToken) return { sent: false };

  const result = await sendPushToToken(prefs.fcmToken, {
    title: "You've arrived!",
    body: `You're at ${placeName}`,
  });

  if (!result.success && result.deadToken) {
    await getAdminDb().collection(PREFS_COLLECTION).doc(uid).set({ fcmToken: null }, { merge: true });
  }

  return { sent: result.success };
}

function sentDocId(uid: string, placeSlug: string): string {
  return `${uid}_${placeSlug}`;
}

/**
 * Checks the places a user is currently close to and pushes a "new place
 * nearby" notification for ones that qualify — cutting the previous
 * notify-everyone-at-publish-time approach down to only:
 *   - published within the last 7 days,
 *   - already has at least one real visit (geofence arrival) AND one rating
 *     from someone else — i.e. proven out, not just admin-created,
 *   - the requesting user is within 0.75 mi of it right now,
 *   - and this user hasn't already been notified about this place.
 * Only ever notifies the single user who called this (their real-time
 * location), never a mass blast.
 */
export async function checkNearbyNewPlaces(uid: string, lat: number, lng: number): Promise<{ notified: string[] }> {
  const prefs = await getNotificationPrefs(uid);
  if (!prefs?.notifyNewPlaces || !prefs.fcmToken) return { notified: [] };

  const cutoff = Date.now() - NEW_PLACE_WINDOW_MS;
  const places = await listPlaces();
  const candidates = places.filter(
    (p) => p.status === 'published' && p.createdAt >= cutoff && p.lat != null && p.lng != null
  );
  if (candidates.length === 0) return { notified: [] };

  const db = getAdminDb();
  const notified: string[] = [];

  for (const place of candidates) {
    const distance = haversineMi(lat, lng, place.lat as number, place.lng as number);
    if (distance >= NEARBY_RADIUS_MI) continue;

    const [visits, summary] = await Promise.all([getArrivalCount(place.slug), getReviewSummary(place.slug)]);
    if (visits === 0 || summary.reviewCount === 0) continue;

    const sentRef = db.collection(SENT_COLLECTION).doc(sentDocId(uid, place.slug));
    const alreadySent = await sentRef.get();
    if (alreadySent.exists) continue;

    const result = await sendPushToToken(prefs.fcmToken, {
      title: 'New place near you',
      body: `${place.title} — ${place.subtitle}`,
      placeSlug: place.slug,
    });

    if (result.success) {
      await sentRef.set({ uid, placeSlug: place.slug, sentAt: Date.now() });
      notified.push(place.slug);
    } else if (result.deadToken) {
      // Clear the dead token on this user's own prefs doc so we stop retrying it.
      await db.collection(PREFS_COLLECTION).doc(uid).set({ fcmToken: null }, { merge: true });
      break;
    }
  }

  return { notified };
}

async function sendPushToToken(
  token: string,
  message: { title: string; body: string; placeSlug?: string }
): Promise<{ success: boolean; deadToken: boolean }> {
  try {
    await getMessaging(getAdminApp()).send({
      token,
      notification: { title: message.title, body: message.body },
      ...(message.placeSlug ? { data: { placeSlug: message.placeSlug } } : {}),
    });
    return { success: true, deadToken: false };
  } catch (error) {
    const code = (error as { code?: string }).code;
    const deadToken = code === 'messaging/invalid-registration-token' || code === 'messaging/registration-token-not-registered';
    console.error('Send push error:', error);
    return { success: false, deadToken };
  }
}
