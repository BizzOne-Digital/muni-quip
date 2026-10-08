export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product } from '@/models/Product';

export async function GET(request: NextRequest): Promise<NextResponse> {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured');
  const query: Record<string, unknown> = { published: true };
  if (featured === 'true') query.featured = true;

  const products = await Product.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
  return NextResponse.json({ products });
}
