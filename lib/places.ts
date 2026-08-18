import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';

export interface PlaceImage {
  url: string;
  key: string;
}

export interface PlaceRecord {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  vibes: string[];
  address: string;
  lat: number | null;
  lng: number | null;
  about: string;
  heroImage: PlaceImage | null;
  galleryImages: PlaceImage[];
  youtubeUrl: string;
  status: 'draft' | 'published';
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

const PLACES_COLLECTION = 'places';

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80) || 'untitled-place';
}

export async function createPlace(data: Omit<PlaceRecord, 'slug' | 'createdAt' | 'updatedAt'> & { slug?: string }): Promise<PlaceRecord> {
  const baseSlug = data.slug || slugify(data.title);
  let slug = baseSlug;
  let attempt = 1;

  // Ensure slug uniqueness
  while ((await getDoc(doc(db, PLACES_COLLECTION, slug))).exists()) {
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  const now = Date.now();
  const record: PlaceRecord = {
    ...data,
    slug,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, PLACES_COLLECTION, slug), record);
  return record;
}

export async function updatePlace(slug: string, data: Partial<Omit<PlaceRecord, 'slug' | 'createdAt'>>): Promise<void> {
  await updateDoc(doc(db, PLACES_COLLECTION, slug), {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function getPlace(slug: string): Promise<PlaceRecord | null> {
  const snap = await getDoc(doc(db, PLACES_COLLECTION, slug));
  if (!snap.exists()) return null;
  return snap.data() as PlaceRecord;
}

export async function listPlaces(): Promise<PlaceRecord[]> {
  const q = query(collection(db, PLACES_COLLECTION), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as PlaceRecord);
}

export async function deletePlace(slug: string): Promise<void> {
  await deleteDoc(doc(db, PLACES_COLLECTION, slug));
}
