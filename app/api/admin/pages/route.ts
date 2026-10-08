export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { PageContent } from '@/models/PageContent';
import { requireAdmin, revalidatePublic, pickFields, errorMessage, PAGE_FIELDS, PAGE_KEYS } from '@/lib/admin';
import { deleteRemovedUploads } from '@/lib/uploads';

const isPageKey = (k: unknown): k is (typeof PAGE_KEYS)[number] =>
  typeof k === 'string' && (PAGE_KEYS as readonly string[]).includes(k);

export async function GET(request: NextRequest): Promise<NextResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const key = request.nextUrl.searchParams.get('key') ?? 'home';
  if (!isPageKey(key)) return NextResponse.json({ error: 'Unknown page' }, { status: 400 });

  await connectDB();
  const page = await PageContent.findOne({ pageKey: key }).lean();
  return NextResponse.json({ page });
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    if (!isPageKey(body.pageKey)) return NextResponse.json({ error: 'Unknown page' }, { status: 400 });

    await connectDB();
    const before = await PageContent.findOne({ pageKey: body.pageKey }).lean();
    const page = await PageContent.findOneAndUpdate(
      { pageKey: body.pageKey },
      { pageKey: body.pageKey, ...pickFields(body, PAGE_FIELDS) },
      { new: true, upsert: true, runValidators: true }
    );
    const imagesOf = (p?: { heroImage?: string; blocks?: Record<string, string> } | null) =>
      [p?.heroImage ?? '', ...Object.values(p?.blocks ?? {})];
    await deleteRemovedUploads(imagesOf(before), imagesOf(page));
    revalidatePublic();
    return NextResponse.json({ page });
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 });
  }
}
