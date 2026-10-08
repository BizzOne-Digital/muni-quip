export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Booking } from '@/models/Booking';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '20');
  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    Booking.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Booking.countDocuments({}),
  ]);

  return NextResponse.json({ bookings, total, page, limit });
}
