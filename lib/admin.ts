import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminSession } from './auth';

/** Returns a 401 response when the request has no valid admin session, otherwise null. */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getAdminSession();
  return session ? null : NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

/** Refresh every public page after admin content changes. */
export function revalidatePublic(): void {
  try {
    revalidatePath('/', 'layout');
  } catch (err) {
    console.error('revalidate failed', err);
  }
}

/** Keeps only the listed keys from an untrusted request body. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- validated by the Mongoose schema
type Loose = any;

export function pickFields<T extends string>(body: Record<string, unknown>, keys: readonly T[]): Partial<Record<T, Loose>> {
  const out: Partial<Record<T, Loose>> = {};
  for (const k of keys) if (k in body) out[k] = body[k];
  return out;
}

export function errorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error && (error as { code: number }).code === 11000) {
    return 'That slug is already in use. Please choose another.';
  }
  return error instanceof Error ? error.message : 'Server error';
}

export const PRODUCT_FIELDS = [
  'nameEn', 'nameFr', 'slug', 'subtitleEn', 'subtitleFr', 'category', 'brand', 'price',
  'shortDescriptionEn', 'shortDescriptionFr', 'fullDescriptionEn', 'fullDescriptionFr',
  'benefitsEn', 'benefitsFr', 'applicationsEn', 'applicationsFr', 'specifications',
  'heroImage', 'galleryImages', 'sortOrder', 'featured', 'published',
  'seoTitleEn', 'seoTitleFr', 'seoDescriptionEn', 'seoDescriptionFr',
] as const;

export const SERVICE_FIELDS = [
  'titleEn', 'titleFr', 'slug', 'headlineEn', 'headlineFr', 'shortDescriptionEn', 'shortDescriptionFr',
  'fullContentEn', 'fullContentFr', 'image', 'icon', 'ctaEn', 'ctaFr', 'sortOrder', 'published',
] as const;

export const PAGE_FIELDS = [
  'heroHeadingEn', 'heroHeadingFr', 'heroDescriptionEn', 'heroDescriptionFr',
  'heroCta1En', 'heroCta1Fr', 'heroCta2En', 'heroCta2Fr', 'heroImage',
  'section1HeadingEn', 'section1HeadingFr', 'section1TextEn', 'section1TextFr',
  'seoTitleEn', 'seoTitleFr', 'seoDescriptionEn', 'seoDescriptionFr', 'blocks',
] as const;

export const SETTINGS_FIELDS = [
  'siteName', 'taglineEn', 'taglineFr', 'phone', 'email', 'address', 'city', 'province', 'postalCode',
  'serviceAreaEn', 'serviceAreaFr', 'logo', 'footerTextEn', 'footerTextFr',
  'socialFacebook', 'socialLinkedin', 'socialTwitter',
] as const;

export const PAGE_KEYS = ['home', 'about', 'services', 'contact', 'booking'] as const;

export const SUBMISSION_STATUSES = ['new', 'read', 'contacted'] as const;
