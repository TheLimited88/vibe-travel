import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
  },
});

export interface UploadResult {
  thumbnail: string;
  mobile: string;
  desktop: string;
  original: string;
}

export async function uploadToR2(
  placeId: string,
  imageType: string,
  imageBuffer: Buffer,
  variant: 'thumbnail' | 'mobile' | 'desktop' | 'original',
  format: string = 'webp'
): Promise<string> {
  const fileName = `places/${placeId}/${imageType}/${variant}.${format}`;

  try {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: fileName,
        Body: imageBuffer,
        ContentType: `image/${format}`,
        CacheControl: 'public, max-age=31536000', // Cache for 1 year (immutable)
      })
    );

    // Return public URL
    const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    return `${baseUrl}/${fileName}`;
  } catch (error) {
    throw new Error(
      `Failed to upload to R2: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function uploadProcessedImages(
  placeId: string,
  imageType: string,
  thumbnail: Buffer,
  mobile: Buffer,
  desktop: Buffer,
  format: string = 'webp'
): Promise<UploadResult> {
  try {
    const [thumbnailUrl, mobileUrl, desktopUrl] = await Promise.all([
      uploadToR2(placeId, imageType, thumbnail, 'thumbnail', format),
      uploadToR2(placeId, imageType, mobile, 'mobile', format),
      uploadToR2(placeId, imageType, desktop, 'desktop', format),
    ]);

    return {
      thumbnail: thumbnailUrl,
      mobile: mobileUrl,
      desktop: desktopUrl,
      original: '', // Will be set if needed
    };
  } catch (error) {
    throw new Error(
      `Failed to upload processed images: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export function getPublicUrl(fileName: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  return `${baseUrl}/${fileName}`;
}
