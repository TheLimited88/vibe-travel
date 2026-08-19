import { getContentPage, setContentPage, CONTENT_PAGE_KEYS, type ContentSection } from '@/lib/contentPages';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key || !CONTENT_PAGE_KEYS.includes(key)) {
      return Response.json({ error: 'Invalid page key' }, { status: 400 });
    }

    const data = await getContentPage(key);
    return Response.json({ success: true, ...data });
  } catch (error) {
    console.error('Get content page error:', error);
    return Response.json({ error: 'Failed to load content page' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const key = body.key as string;
    const sections = body.sections as ContentSection[];

    if (!key || !CONTENT_PAGE_KEYS.includes(key)) {
      return Response.json({ error: 'Invalid page key' }, { status: 400 });
    }
    if (!Array.isArray(sections)) {
      return Response.json({ error: 'Sections must be an array' }, { status: 400 });
    }

    const updatedAt = await setContentPage(key, sections);
    return Response.json({ success: true, updatedAt });
  } catch (error) {
    console.error('Save content page error:', error);
    return Response.json({ error: 'Failed to save content page' }, { status: 500 });
  }
}
