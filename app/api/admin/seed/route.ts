export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { seedDefaults } from '@/lib/seed';
import { requireAdmin, revalidatePublic, errorMessage } from '@/lib/admin';

/**
 * POST /api/admin/seed — imports the default MUNI-QUIP services, products and
 * contact settings. Records that already exist (matched by slug) are never overwritten.
 */
export async function POST(): Promise<NextResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    await connectDB();
    const result = await seedDefaults();
    revalidatePublic();
    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}
