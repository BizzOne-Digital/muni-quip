import { Product } from '@/models/Product';
import { Service } from '@/models/Service';
import { SiteSettings } from '@/models/SiteSettings';
import { PageContent } from '@/models/PageContent';
import { DEFAULT_PRODUCTS, DEFAULT_SERVICES, DEFAULT_SETTINGS } from './defaults';
import { DEFAULT_PAGES } from './pageBlocks';

/**
 * Inserts the default MUNI-QUIP content. Records that already exist
 * (matched by slug / pageKey) are never overwritten. Caller must connect first.
 */
export async function seedDefaults(): Promise<{ services: number; products: number; pages: number }> {
  let services = 0;
  let products = 0;
  let pages = 0;

  for (const s of DEFAULT_SERVICES) {
    services += (await Service.updateOne({ slug: s.slug }, { $setOnInsert: s }, { upsert: true })).upsertedCount;
  }
  for (const p of DEFAULT_PRODUCTS) {
    products += (await Product.updateOne({ slug: p.slug }, { $setOnInsert: p }, { upsert: true })).upsertedCount;
  }
  for (const page of DEFAULT_PAGES) {
    pages += (await PageContent.updateOne({ pageKey: page.pageKey }, { $setOnInsert: page }, { upsert: true })).upsertedCount;
  }
  if (!(await SiteSettings.exists({}))) await SiteSettings.create(DEFAULT_SETTINGS);

  return { services, products, pages };
}

declare global {
  var muniQuipSeeded: Promise<void> | undefined;
}

/**
 * First-run bootstrap: when the database is completely empty, load the default
 * content once so every page and the admin panel start from real DB records.
 */
export function ensureSeeded(): Promise<void> {
  if (!global.muniQuipSeeded) {
    global.muniQuipSeeded = (async () => {
      const [svc, prod, settings] = await Promise.all([
        Service.estimatedDocumentCount(),
        Product.estimatedDocumentCount(),
        SiteSettings.estimatedDocumentCount(),
      ]);
      if (svc === 0 && prod === 0 && settings === 0) await seedDefaults();
    })().catch((err) => {
      global.muniQuipSeeded = undefined;
      throw err;
    });
  }
  return global.muniQuipSeeded;
}
