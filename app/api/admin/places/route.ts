import { createPlace, listPlaces, getPlace, updatePlace, deletePlace, slugify } from '@/lib/places';
import { getArrivalCount, getReviewSummary } from '@/lib/placeReviews';
import { getSaveCount } from '@/lib/savedPlaces';
import { notifyNewPlaceNearby } from '@/lib/notifications';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const place = await getPlace(slug);
      if (!place) {
        return Response.json({ error: 'Place not found' }, { status: 404 });
      }
      return Response.json({ success: true, place });
    }

    const places = await listPlaces();

    if (!searchParams.has('includeStats')) {
      return Response.json({ success: true, places });
    }

    const withStats = await Promise.all(
      places.map(async (place) => {
        const [visits, summary, saves] = await Promise.all([
          getArrivalCount(place.slug),
          getReviewSummary(place.slug),
          getSaveCount(place.slug),
        ]);
        const worthPct = summary.reviewCount > 0 ? Math.round((100 * summary.upCount) / summary.reviewCount) : null;
        return { ...place, visits, worthPct, saves };
      })
    );

    return Response.json({ success: true, places: withStats });
  } catch (error) {
    console.error('List places error:', error);
    return Response.json({ error: 'Failed to load places' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return Response.json({ error: 'Title is required' }, { status: 400 });
    }

    const record = await createPlace({
      title: body.title.trim(),
      subtitle: body.subtitle || '',
      category: body.category || '',
      vibes: Array.isArray(body.vibes) ? body.vibes.slice(0, 2) : [],
      address: body.address || '',
      lat: typeof body.lat === 'number' ? body.lat : null,
      lng: typeof body.lng === 'number' ? body.lng : null,
      about: body.about || '',
      heroImage: body.heroImage || null,
      galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages : [],
      youtubeUrl: body.youtubeUrl || '',
      videoLinks: Array.isArray(body.videoLinks) ? body.videoLinks : [],
      status: body.status === 'published' ? 'published' : 'draft',
      createdBy: body.createdBy || 'Admin',
      slug: body.slug ? slugify(body.slug) : undefined,
    });

    if (record.status === 'published') {
      try {
        await notifyNewPlaceNearby(record);
      } catch (error) {
        console.error('Notify new place error:', error);
      }
    }

    return Response.json({ success: true, place: record });
  } catch (error) {
    console.error('Create place error:', error);
    return Response.json({ error: 'Failed to save place' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) {
      return Response.json({ error: 'Missing slug' }, { status: 400 });
    }

    const body = await request.json();
    const before = await getPlace(slug);
    await updatePlace(slug, body);

    const wasPublished = before?.status === 'published';
    const nowPublished = body.status === 'published' || (body.status === undefined && wasPublished);
    if (!wasPublished && nowPublished) {
      const updated = await getPlace(slug);
      if (updated) {
        try {
          await notifyNewPlaceNearby(updated);
        } catch (error) {
          console.error('Notify new place error:', error);
        }
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Update place error:', error);
    return Response.json({ error: 'Failed to update place' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) {
      return Response.json({ error: 'Missing slug' }, { status: 400 });
    }

    await deletePlace(slug);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete place error:', error);
    return Response.json({ error: 'Failed to delete place' }, { status: 500 });
  }
}
