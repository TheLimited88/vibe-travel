import convertHeic from 'heic-convert';

const HEIC_BRANDS = ['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'hevm', 'hevs', 'mif1', 'msf1'];

/**
 * iPhones default to HEIC/HEIF, which Vercel's sharp build can't decode
 * natively (the HEIF codec is licensed and excluded from prebuilt binaries).
 * Detects HEIC by inspecting the file's ISO-BMFF 'ftyp' box directly — more
 * reliable than trusting a browser-reported MIME type, which HEIC uploads
 * often get wrong or omit entirely.
 */
function isHeicBuffer(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;
  if (buffer.toString('ascii', 4, 8) !== 'ftyp') return false;
  return HEIC_BRANDS.includes(buffer.toString('ascii', 8, 12));
}

export async function convertHeicIfNeeded(buffer: Buffer): Promise<Buffer> {
  if (!isHeicBuffer(buffer)) return buffer;

  const jpegOutput = await convertHeic({
    buffer,
    format: 'JPEG',
    quality: 0.9,
  });

  return Buffer.from(jpegOutput);
}
