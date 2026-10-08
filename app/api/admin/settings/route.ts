export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SiteSettings } from '@/models/SiteSettings';
import { requireAdmin, revalidatePublic, pickFields, errorMessage, SETTINGS_FIELDS } from '@/lib/admin';
import { deleteRemovedUploads } from '@/lib/uploads';

export async function GET(): Promise<NextResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  await connectDB();
  const settings = (await SiteSettings.findOne({}).lean()) ?? (await SiteSettings.create({})).toObject();
  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    await connectDB();
    const before = await SiteSettings.findOne({}).lean();
    const settings = await SiteSettings.findOneAndUpdate({}, pickFields(body, SETTINGS_FIELDS), {
      new: true,
      upsert: true,
      runValidators: true,
    });
    await deleteRemovedUploads([before?.logo ?? ''], [settings.logo]);
    revalidatePublic();
    return NextResponse.json({ settings });
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 });
  }
}
