export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import connectDB from '@/lib/mongodb';
import { StoredUpload } from '@/models/StoredUpload';
import { getAdminSession } from '@/lib/auth';
import { isAllowedFolder, deleteStoredUploadByUrl, parseUploadUrl } from '@/lib/uploads';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 8 * 1024 * 1024; // 8MB

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };
  return map[mimeType] ?? 'bin';
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Check admin authentication
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const entry = formData.get('file');
    const file = entry instanceof File ? entry : null;
    const folder = formData.get('folder') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!isAllowedFolder(folder)) {
      return NextResponse.json({ error: 'Invalid folder' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 8MB)' }, { status: 400 });
    }

    const ext = getExtension(file.type);
    const randomHex = randomBytes(6).toString('hex');
    const filename = `${Date.now()}-${randomHex}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await connectDB();
    await StoredUpload.create({
      folder,
      filename,
      mimeType: file.type,
      size: file.size,
      data: buffer,
    });

    return NextResponse.json({
      success: true,
      url: `/api/uploads/${folder}/${filename}`,
      filename,
      size: file.size,
      folder,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

/** DELETE /api/upload?url=/api/uploads/<folder>/<filename> — removes a stored image (admin only). */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = request.nextUrl.searchParams.get('url') ?? '';
  if (!parseUploadUrl(url)) {
    // External or legacy URLs are not stored in MongoDB; nothing to delete.
    return NextResponse.json({ success: true, deleted: false });
  }

  const deleted = await deleteStoredUploadByUrl(url);
  return NextResponse.json({ success: true, deleted });
}
