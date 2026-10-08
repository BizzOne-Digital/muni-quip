export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { StoredUpload } from '@/models/StoredUpload';
import { isAllowedFolder, isSafeFilename } from '@/lib/uploads';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ folder: string; filename: string }> }
): Promise<Response> {
  const { folder, filename } = await params;

  if (!isAllowedFolder(folder)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (!isSafeFilename(filename)) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
  }

  try {
    await connectDB();
    const file = await StoredUpload.findOne({ folder, filename }).lean();
    if (!file) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Mongoose may return a Buffer or a BSON Binary depending on lean(); normalise to Uint8Array.
    const raw = file.data as unknown as Buffer | { buffer: ArrayBuffer | Uint8Array };
    const bytes = Buffer.isBuffer(raw) ? raw : Buffer.from(raw.buffer as Uint8Array);
    const body = new Uint8Array(new ArrayBuffer(bytes.byteLength));
    body.set(bytes);

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': file.mimeType,
        'Content-Length': body.byteLength.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Image serve error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
