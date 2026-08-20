import { listUsers, updateUser } from '@/lib/adminUsers';
import { getAdminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET() {
  try {
    const users = await listUsers();
    return Response.json({ success: true, users });
  } catch (error) {
    console.error('List users error:', error);
    return Response.json({ error: 'Failed to load users' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = body.id as string;

    if (!id) {
      return Response.json({ error: 'Missing user id' }, { status: 400 });
    }
    if (body.status && body.status !== 'active' && body.status !== 'suspended') {
      return Response.json({ error: 'Invalid status' }, { status: 400 });
    }

    await updateUser(id, { name: body.name, status: body.status });
    return Response.json({ success: true });
  } catch (error) {
    console.error('Update user error:', error);
    return Response.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// TEMPORARY: scoped to a hardcoded allowlist of known test-account UIDs so this
// can't be used to delete a real user's data. Remove once test cleanup is done.
const TEMP_DELETE_ALLOWLIST = ['6ROTeC33sWTFdpfR6WBm4NqfS5f1', 'yatSVJGDWyfFgYMFMPniR5gsCzR2'];

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const id = body.id as string;

    if (!id || !TEMP_DELETE_ALLOWLIST.includes(id)) {
      return Response.json({ error: 'Not allowed' }, { status: 403 });
    }

    await getAdminDb().collection('users').doc(id).delete();
    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return Response.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
