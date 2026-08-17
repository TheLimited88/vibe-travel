import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'hero' or 'gallery'

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Compress image based on type
    let compressed: Buffer;
    if (type === 'hero') {
      compressed = await sharp(buffer)
        .resize(1080, 1080, { fit: 'cover' })
        .jpeg({ quality: 80, progressive: true })
        .toBuffer();
    } else {
      // Gallery images - smaller
      compressed = await sharp(buffer)
        .resize(500, 400, { fit: 'cover' })
        .jpeg({ quality: 75, progressive: true })
        .toBuffer();
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${type}-${timestamp}-${Math.random().toString(36).substring(7)}.jpg`;
    const key = `places/${filename}`;

    // Upload to Cloudflare R2
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
        Body: compressed,
        ContentType: 'image/jpeg',
      })
    );

    const imageUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return Response.json({
      success: true,
      url: imageUrl,
      key: key,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { key } = await request.json();

    if (!key) {
      return Response.json({ error: 'No key provided' }, { status: 400 });
    }

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
      })
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return Response.json({ error: 'Delete failed' }, { status: 500 });
  }
}
