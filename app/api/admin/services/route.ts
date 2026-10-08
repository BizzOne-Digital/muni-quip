export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Service } from '@/models/Service';
import { requireAdmin, revalidatePublic, pickFields, errorMessage, SERVICE_FIELDS } from '@/lib/admin';

export async function GET(): Promise<NextResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  await connectDB();
  const services = await Service.find({}).sort({ sortOrder: 1, createdAt: -1 }).lean();
  return NextResponse.json({ services });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    await connectDB();
    const service = await Service.create(pickFields(body, SERVICE_FIELDS));
    revalidatePublic();
    return NextResponse.json({ service }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 });
  }
}
