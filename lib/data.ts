import connectDB, { isDbConfigured } from './mongodb';
import {
  DEFAULT_PRODUCTS,
  DEFAULT_SERVICES,
  DEFAULT_SETTINGS,
  type PageContentData,
  type ProductData,
  type ServiceData,
  type SettingsData,
} from './defaults';
import { Product } from '@/models/Product';
import { Service } from '@/models/Service';
import { PageContent } from '@/models/PageContent';
import { SiteSettings } from '@/models/SiteSettings';
import { GalleryItem } from '@/models/GalleryItem';
import { ensureSeeded } from './seed';
import { DEFAULT_PAGES } from './pageBlocks';

// Public read helpers. Every function falls back to the brief's default
// content when MongoDB is unreachable or a collection has not been seeded yet,
// so the public site never renders empty.

function plain<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!isDbConfigured()) return fallback;
  try {
    await connectDB();
    await ensureSeeded();
    return await fn();
  } catch (err) {
    console.error('[data] falling back to defaults:', err instanceof Error ? err.message : err);
    return fallback;
  }
}

export async function getServices(): Promise<ServiceData[]> {
  return safe(async () => {
    const docs = await Service.find({ published: true }).sort({ sortOrder: 1, createdAt: 1 }).lean();
    return plain<ServiceData[]>(docs);
  }, DEFAULT_SERVICES);
}

export async function getProducts(opts: { featured?: boolean; category?: string } = {}): Promise<ProductData[]> {
  const filterDefaults = (list: ProductData[]) =>
    list.filter(
      (p) => p.published && (!opts.featured || p.featured) && (!opts.category || p.category === opts.category)
    );

  return safe(async () => {
    const query: Record<string, unknown> = { published: true };
    if (opts.featured) query.featured = true;
    if (opts.category) query.category = opts.category;
    const docs = await Product.find(query).sort({ sortOrder: 1, createdAt: 1 }).lean();
    return plain<ProductData[]>(docs);
  }, filterDefaults(DEFAULT_PRODUCTS));
}

export async function getProductBySlug(slug: string): Promise<ProductData | null> {
  const fallback = DEFAULT_PRODUCTS.find((p) => p.slug === slug) ?? null;
  return safe(async () => {
    const doc = await Product.findOne({ slug, published: true }).lean();
    return doc ? plain<ProductData>(doc) : null;
  }, fallback);
}

export async function getPageContent(pageKey: string): Promise<PageContentData> {
  return safe(async () => {
    const doc = await PageContent.findOne({ pageKey }).lean();
    return doc ? plain<PageContentData>(doc) : { pageKey };
  }, DEFAULT_PAGES.find((p) => p.pageKey === pageKey) ?? { pageKey });
}

export async function getSettings(): Promise<SettingsData> {
  return safe(async () => {
    const doc = await SiteSettings.findOne({}).lean();
    return doc ? { ...DEFAULT_SETTINGS, ...plain<Partial<SettingsData>>(doc) } : DEFAULT_SETTINGS;
  }, DEFAULT_SETTINGS);
}

export interface GalleryData {
  _id: string;
  url: string;
  captionEn: string;
  captionFr: string;
}

export async function getGallery(): Promise<GalleryData[]> {
  return safe(async () => {
    const docs = await GalleryItem.find({ published: true }).sort({ sortOrder: 1, createdAt: -1 }).lean();
    return plain<GalleryData[]>(docs);
  }, []);
}

export { pick, pickList } from './localization';
