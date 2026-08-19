import { getAdminProfile, setAdminProfile } from '@/lib/adminProfile';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET() {
  try {
    const profile = await getAdminProfile();
    return Response.json({ success: true, ...profile });
  } catch (error) {
    console.error('Get admin profile error:', error);
    return Response.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { photoUrl, photoKey } = await request.json();
    await setAdminProfile(photoUrl || null, photoKey || null);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Save admin profile error:', error);
    return Response.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
