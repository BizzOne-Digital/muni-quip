export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import connectDB from '@/lib/mongodb';
import { GalleryItem } from '@/models/GalleryItem';
import { requireAdmin, revalidatePublic, pickFields, errorMessage } from '@/lib/admin';
import { deleteStoredUploadByUrl } from '@/lib/uploads';

type Ctx = { params: Promise<{ id: string }> };
const FIELDS = ['captionEn', 'captionFr', 'sortOrder', 'published'] as const;

export async function PUT(request: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  try {
    await connectDB();
    const item = await GalleryItem.findByIdAndUpdate(id, pickFields(await request.json(), FIELDS), { new: true });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    revalidatePublic();
    return NextResponse.json({ item });
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await connectDB();
  const item = await GalleryItem.findByIdAndDelete(id);
  if (item) await deleteStoredUploadByUrl(item.url);
  revalidatePublic();
  return NextResponse.json({ success: true });
}
