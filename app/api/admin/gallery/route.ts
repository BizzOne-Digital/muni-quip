export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { GalleryItem } from '@/models/GalleryItem';
import { requireAdmin, revalidatePublic, pickFields, errorMessage } from '@/lib/admin';

const FIELDS = ['url', 'captionEn', 'captionFr', 'sortOrder', 'published'] as const;

export async function GET(): Promise<NextResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  await connectDB();
  const items = await GalleryItem.find({}).sort({ sortOrder: 1, createdAt: -1 }).lean();
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    if (!body.url) return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    await connectDB();
    const item = await GalleryItem.create(pickFields(body, FIELDS));
    revalidatePublic();
    return NextResponse.json({ item }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 });
  }
}
