export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import connectDB from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { requireAdmin, revalidatePublic, pickFields, errorMessage, PRODUCT_FIELDS } from '@/lib/admin';
import { deleteStoredUploadByUrl, deleteRemovedUploads } from '@/lib/uploads';

type Ctx = { params: Promise<{ id: string }> };

const imagesOf = (p: { heroImage?: string; galleryImages?: string[] }) => [p.heroImage ?? '', ...(p.galleryImages ?? [])];

export async function GET(_request: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(request: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  try {
    const body = await request.json();
    await connectDB();
    const before = await Product.findById(id).lean();
    if (!before) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const product = await Product.findByIdAndUpdate(id, pickFields(body, PRODUCT_FIELDS), { new: true, runValidators: true });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // The new URLs are saved, so images that were replaced or removed can now be dropped.
    await deleteRemovedUploads(imagesOf(before), imagesOf(product));
    revalidatePublic();
    return NextResponse.json({ product });
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
  const product = await Product.findByIdAndDelete(id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await Promise.all(imagesOf(product).map((url) => deleteStoredUploadByUrl(url)));
  revalidatePublic();
  return NextResponse.json({ success: true });
}
