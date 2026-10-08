export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ContactSubmission } from '@/models/ContactSubmission';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '20');
  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    ContactSubmission.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ContactSubmission.countDocuments({}),
  ]);

  return NextResponse.json({ messages, total, page, limit });
}
