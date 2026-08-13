import { NextRequest, NextResponse } from 'next/server';
import { processImage, getCompressionStats } from '@/lib/imageProcessing';
import { uploadProcessedImages } from '@/lib/r2Storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const placeId = formData.get('placeId') as string;
    const imageType = formData.get('imageType') as string; // 'hero', 'gallery', 'profile', etc.

    // Validation
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!placeId || !imageType) {
      return NextResponse.json(
        { error: 'placeId and imageType are required' },
        { status: 400 }
      );
    }

    // Check file size
    const maxSize = parseInt(
      process.env.MAX_IMAGE_FILE_SIZE || '15000000'
    );
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size: ${(maxSize / 1000000).toFixed(1)}MB`,
        },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Process image (compress to 3 sizes)
    const processedImages = await processImage(buffer);

    // Get compression stats
    const stats = getCompressionStats(buffer, processedImages);

    // Upload to R2
    const urls = await uploadProcessedImages(
      placeId,
      imageType,
      processedImages.thumbnail,
      processedImages.mobile,
      processedImages.desktop,
      process.env.IMAGE_COMPRESSION_FORMAT || 'webp'
    );

    return NextResponse.json(
      {
        success: true,
        urls,
        stats: {
          originalSize: `${(stats.originalSize / 1000).toFixed(1)}KB`,
          compressedSize: `${(stats.compressedSize / 1000).toFixed(1)}KB`,
          reduction: `${(stats.reduction / 1000).toFixed(1)}KB`,
          compressionPercentage: `${stats.compressionPercentage}%`,
        },
        message: `Image compressed by ${stats.compressionPercentage}%`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to process image',
      },
      { status: 500 }
    );
  }
}
