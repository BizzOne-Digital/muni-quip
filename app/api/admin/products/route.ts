export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { requireAdmin, revalidatePublic, pickFields, errorMessage, PRODUCT_FIELDS } from '@/lib/admin';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  await connectDB();
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1') || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '50') || 50));
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find({}).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments({}),
  ]);

  return NextResponse.json({ products, total, page, limit });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    await connectDB();
    const product = await Product.create(pickFields(body, PRODUCT_FIELDS));
    revalidatePublic();
    return NextResponse.json({ product }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 });
  }
}
