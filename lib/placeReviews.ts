import { getAdminDb } from '@/lib/firebaseAdmin';

const ARRIVALS_COLLECTION = 'placeArrivals';
const REVIEWS_COLLECTION = 'placeReviews';

function docId(uid: string, placeSlug: string): string {
  return `${uid}_${placeSlug}`;
}

export interface PlaceArrival {
  uid: string;
  placeSlug: string;
  arrivedAt: number;
}

export async function recordArrival(uid: string, placeSlug: string): Promise<void> {
  await getAdminDb()
    .collection(ARRIVALS_COLLECTION)
    .doc(docId(uid, placeSlug))
    .set({ uid, placeSlug, arrivedAt: Date.now() }, { merge: true });
}

export async function hasArrived(uid: string, placeSlug: string): Promise<boolean> {
  const snap = await getAdminDb().collection(ARRIVALS_COLLECTION).doc(docId(uid, placeSlug)).get();
  return snap.exists;
}

export interface PlaceReview {
  uid: string;
  placeSlug: string;
  thumbsUp: boolean;
  vibeTags: string[];
  createdAt: number;
}

export async function getReview(uid: string, placeSlug: string): Promise<PlaceReview | null> {
  const snap = await getAdminDb().collection(REVIEWS_COLLECTION).doc(docId(uid, placeSlug)).get();
  return snap.exists ? (snap.data() as PlaceReview) : null;
}

/**
 * Creates the review iff one doesn't already exist for this user+place.
 * Returns false (no-op) if a review already exists.
 */
export async function createReviewOnce(
  uid: string,
  placeSlug: string,
  thumbsUp: boolean,
  vibeTags: string[]
): Promise<boolean> {
  const ref = getAdminDb().collection(REVIEWS_COLLECTION).doc(docId(uid, placeSlug));

  return getAdminDb().runTransaction(async (tx) => {
    const existing = await tx.get(ref);
    if (existing.exists) return false;

    const review: PlaceReview = { uid, placeSlug, thumbsUp, vibeTags, createdAt: Date.now() };
    tx.set(ref, review);
    return true;
  });
}

export interface ReviewSummary {
  reviewCount: number;
  upCount: number;
  downCount: number;
  vibeTagCounts: Record<string, number>;
}

export async function getReviewSummary(placeSlug: string): Promise<ReviewSummary> {
  const snap = await getAdminDb().collection(REVIEWS_COLLECTION).where('placeSlug', '==', placeSlug).get();

  let upCount = 0;
  let downCount = 0;
  const vibeTagCounts: Record<string, number> = {};

  snap.forEach((doc) => {
    const review = doc.data() as PlaceReview;
    if (review.thumbsUp) upCount += 1;
    else downCount += 1;
    for (const tag of review.vibeTags || []) {
      vibeTagCounts[tag] = (vibeTagCounts[tag] || 0) + 1;
    }
  });

  return { reviewCount: snap.size, upCount, downCount, vibeTagCounts };
}
