import sharp from 'sharp';
import { convertHeicIfNeeded } from '@/lib/heicConvert';

export interface ProcessedImages {
  thumbnail: Buffer;
  mobile: Buffer;
  desktop: Buffer;
  originalMetadata: {
    width?: number;
    height?: number;
    format?: string;
  };
}

interface CompressionConfig {
  quality: number;
  maxWidth: number;
  maxHeight: number;
  format: 'webp' | 'jpeg';
}

const COMPRESSION_CONFIGS = {
  thumbnail: {
    quality: parseInt(process.env.IMAGE_COMPRESSION_QUALITY_THUMBNAIL || '20'),
    maxWidth: parseInt(process.env.IMAGE_MAX_WIDTH_THUMBNAIL || '200'),
    maxHeight: parseInt(process.env.IMAGE_MAX_HEIGHT || '1440'),
    format: (process.env.IMAGE_COMPRESSION_FORMAT || 'webp') as 'webp' | 'jpeg',
  },
  mobile: {
    quality: parseInt(process.env.IMAGE_COMPRESSION_QUALITY_MOBILE || '50'),
    maxWidth: parseInt(process.env.IMAGE_MAX_WIDTH_MOBILE || '800'),
    maxHeight: parseInt(process.env.IMAGE_MAX_HEIGHT || '1440'),
    format: (process.env.IMAGE_COMPRESSION_FORMAT || 'webp') as 'webp' | 'jpeg',
  },
  desktop: {
    quality: parseInt(process.env.IMAGE_COMPRESSION_QUALITY_DESKTOP || '65'),
    maxWidth: parseInt(process.env.IMAGE_MAX_WIDTH_DESKTOP || '1440'),
    maxHeight: parseInt(process.env.IMAGE_MAX_HEIGHT || '1440'),
    format: (process.env.IMAGE_COMPRESSION_FORMAT || 'webp') as 'webp' | 'jpeg',
  },
};

async function compressImage(
  imageBuffer: Buffer,
  config: CompressionConfig
): Promise<Buffer> {
  let processor = sharp(imageBuffer)
    .rotate() // Auto-rotate based on EXIF
    .resize(config.maxWidth, config.maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });

  if (config.format === 'webp') {
    processor = processor.webp({ quality: config.quality });
  } else {
    processor = processor.jpeg({
      quality: config.quality,
      progressive: process.env.IMAGE_PROGRESSIVE_JPEG === 'true',
    });
  }

  return processor.toBuffer();
}

export async function processImage(
  rawImageBuffer: Buffer
): Promise<ProcessedImages> {
  try {
    const imageBuffer = await convertHeicIfNeeded(rawImageBuffer);

    // Get original metadata
    const metadata = await sharp(imageBuffer).metadata();

    // Validate image
    if (!metadata.width || !metadata.height) {
      throw new Error('Invalid image: could not read dimensions');
    }

    // Process all variants in parallel
    const [thumbnail, mobile, desktop] = await Promise.all([
      compressImage(imageBuffer, COMPRESSION_CONFIGS.thumbnail),
      compressImage(imageBuffer, COMPRESSION_CONFIGS.mobile),
      compressImage(imageBuffer, COMPRESSION_CONFIGS.desktop),
    ]);

    return {
      thumbnail,
      mobile,
      desktop,
      originalMetadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
      },
    };
  } catch (error) {
    throw new Error(
      `Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export function getCompressionStats(
  original: Buffer,
  processed: ProcessedImages
): {
  originalSize: number;
  compressedSize: number;
  reduction: number;
  compressionPercentage: number;
} {
  const compressedSize =
    processed.thumbnail.length +
    processed.mobile.length +
    processed.desktop.length;
  const originalSize = original.length;
  const reduction = originalSize - compressedSize;
  const compressionPercentage = ((reduction / originalSize) * 100).toFixed(1);

  return {
    originalSize,
    compressedSize,
    reduction,
    compressionPercentage: parseFloat(compressionPercentage as string),
  };
}
