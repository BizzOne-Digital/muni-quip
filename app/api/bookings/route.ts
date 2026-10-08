export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Booking } from '@/models/Booking';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { name, organization, email, phone, province, preferredDate, serviceType, equipment, message, language } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    await connectDB();
    await Booking.create({
      name, organization, email, phone, province,
      preferredDate, serviceType, equipment, message,
      language: language ?? 'en',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
