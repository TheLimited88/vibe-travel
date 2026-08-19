import { getAdminDb } from '@/lib/firebaseAdmin';

export interface PolicyAcceptance {
  page: 'terms' | 'privacy';
  version: string;
  acceptedAt: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  savedCount: number;
  visitedCount: number;
  signupMethod: string;
  status: 'active' | 'suspended';
  policyAcceptances: PolicyAcceptance[];
}

const COLLECTION = 'users';

function toAdminUser(id: string, data: FirebaseFirestore.DocumentData): AdminUser {
  return {
    id,
    name: data.name || '',
    email: data.email || '',
    createdAt: typeof data.createdAt === 'number' ? data.createdAt : 0,
    savedCount: Array.isArray(data.savedPlaces) ? data.savedPlaces.length : 0,
    visitedCount: Array.isArray(data.visitedPlaces) ? data.visitedPlaces.length : 0,
    signupMethod: data.signupMethod || 'Email',
    status: data.status === 'suspended' ? 'suspended' : 'active',
    policyAcceptances: Array.isArray(data.policyAcceptances) ? data.policyAcceptances : [],
  };
}

export async function listUsers(): Promise<AdminUser[]> {
  const snap = await getAdminDb().collection(COLLECTION).orderBy('createdAt', 'desc').get();
  return snap.docs.map((d) => toAdminUser(d.id, d.data()));
}

export async function updateUser(id: string, updates: { name?: string; status?: 'active' | 'suspended' }): Promise<void> {
  const patch: Record<string, unknown> = { updatedAt: Date.now() };
  if (typeof updates.name === 'string') patch.name = updates.name;
  if (updates.status) patch.status = updates.status;
  await getAdminDb().collection(COLLECTION).doc(id).set(patch, { merge: true });
}
