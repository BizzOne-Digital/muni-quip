export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import { AdminUser } from '@/models/AdminUser';
import { setAdminSession, COOKIE_NAME, SESSION_COOKIE_OPTIONS } from '@/lib/auth';

// Simple in-memory throttle per IP. Serverless instances do not share memory,
// so this only slows down brute force; bcrypt cost is the main protection.
const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 8;
const LOCK_MS = 10 * 60 * 1000;

function tooMany(ip: string): boolean {
  const a = attempts.get(ip);
  return Boolean(a && a.count >= MAX_ATTEMPTS && a.until > Date.now());
}
function recordFailure(ip: string) {
  const a = attempts.get(ip);
  const fresh = !a || a.until < Date.now();
  attempts.set(ip, { count: fresh ? 1 : a.count + 1, until: Date.now() + LOCK_MS });
}

const invalid = () => NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'local';
  if (tooMany(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Please wait 10 minutes and try again.' }, { status: 429 });
  }

  try {
    const { email, password } = await request.json();
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    await connectDB();
    const normalized = email.toLowerCase().trim();
    let admin = await AdminUser.findOne({ email: normalized });

    // First-run bootstrap: when no admin exists yet, create one from ADMIN_EMAIL / ADMIN_PASSWORD.
    if (!admin && (await AdminUser.estimatedDocumentCount()) === 0) {
      const envEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
      const envPassword = process.env.ADMIN_PASSWORD;
      if (!envEmail || !envPassword) {
        return NextResponse.json({ error: 'No admin account exists. Set ADMIN_EMAIL and ADMIN_PASSWORD, then sign in.' }, { status: 503 });
      }
      if (normalized === envEmail && password === envPassword) {
        admin = await AdminUser.create({
          email: envEmail,
          passwordHash: await bcrypt.hash(envPassword, 12),
          name: 'Admin',
          role: 'superadmin',
        });
      }
    }

    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      recordFailure(ip);
      return invalid();
    }

    attempts.delete(ip);
    const token = await setAdminSession({ id: admin._id.toString(), email: admin.email, role: admin.role });
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
