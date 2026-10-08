export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { Service } from '@/models/Service';
import { Booking } from '@/models/Booking';
import { ContactSubmission } from '@/models/ContactSubmission';
import { getAdminSession } from '@/lib/auth';

export async function GET(): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();

  const [
    totalProducts,
    totalServices,
    totalBookings,
    newBookings,
    totalMessages,
    newMessages,
    recentBookings,
    recentMessages,
  ] = await Promise.all([
    Product.countDocuments({}),
    Service.countDocuments({}),
    Booking.countDocuments({}),
    Booking.countDocuments({ status: 'new' }),
    ContactSubmission.countDocuments({}),
    ContactSubmission.countDocuments({ status: 'new' }),
    Booking.find({}).sort({ createdAt: -1 }).limit(5).lean(),
    ContactSubmission.find({}).sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return NextResponse.json({
    stats: {
      totalProducts,
      totalServices,
      totalBookings,
      newBookings,
      totalMessages,
      newMessages,
    },
    recentBookings,
    recentMessages,
  });
}
