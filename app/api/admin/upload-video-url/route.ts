import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
});

const ALLOWED_VIDEO_TYPES: Record<string, string> = {
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'video/x-m4v': 'm4v',
};

const MAX_VIDEO_BYTES = 300 * 1024 * 1024; // 300MB

export async function POST(request: Request) {
  try {
    const { contentType, size } = await request.json();

    const extension = ALLOWED_VIDEO_TYPES[contentType];
    if (!extension) {
      return Response.json({ error: 'Unsupported video format. Use MP4 or MOV.' }, { status: 400 });
    }

    if (typeof size !== 'number' || size <= 0 || size > MAX_VIDEO_BYTES) {
      return Response.json({ error: 'Video must be smaller than 300MB.' }, { status: 400 });
    }

    const timestamp = Date.now();
    const filename = `gallery-${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;
    const key = `places/${filename}`;

    const uploadUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
        ContentType: contentType,
      }),
      { expiresIn: 300 }
    );

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return Response.json({ success: true, uploadUrl, publicUrl, key });
  } catch (error) {
    console.error('Get upload URL error:', error);
    return Response.json({ error: 'Failed to prepare upload' }, { status: 500 });
  }
}
