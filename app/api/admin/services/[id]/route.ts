export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import connectDB from '@/lib/mongodb';
import { Service } from '@/models/Service';
import { requireAdmin, revalidatePublic, pickFields, errorMessage, SERVICE_FIELDS } from '@/lib/admin';
import { deleteStoredUploadByUrl, deleteRemovedUploads } from '@/lib/uploads';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await connectDB();
  const service = await Service.findById(id).lean();
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ service });
}

export async function PUT(request: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  try {
    const body = await request.json();
    await connectDB();
    const before = await Service.findById(id).lean();
    if (!before) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const service = await Service.findByIdAndUpdate(id, pickFields(body, SERVICE_FIELDS), { new: true, runValidators: true });
    if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await deleteRemovedUploads([before.image], [service.image]);
    revalidatePublic();
    return NextResponse.json({ service });
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
  const service = await Service.findByIdAndDelete(id);
  if (service?.image) await deleteStoredUploadByUrl(service.image);
  revalidatePublic();
  return NextResponse.json({ success: true });
}
