import { listUsers, updateUser } from '@/lib/adminUsers';

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
