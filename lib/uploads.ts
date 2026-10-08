import connectDB from './mongodb';
import { StoredUpload } from '@/models/StoredUpload';

export const ALLOWED_FOLDERS = ['products', 'gallery', 'pages', 'misc'] as const;
export type UploadFolder = (typeof ALLOWED_FOLDERS)[number];

export function isAllowedFolder(folder: unknown): folder is UploadFolder {
  return typeof folder === 'string' && (ALLOWED_FOLDERS as readonly string[]).includes(folder);
}

/** Rejects traversal and anything outside the generated `<timestamp>-<hex>.<ext>` shape. */
export function isSafeFilename(filename: string): boolean {
  if (!filename || filename.length > 100) return false;
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\') || filename.includes('\0')) return false;
  return /^[A-Za-z0-9._-]+$/.test(filename);
}

/** Parses `/api/uploads/<folder>/<filename>` into its parts; returns null for anything else. */
export function parseUploadUrl(url: string): { folder: UploadFolder; filename: string } | null {
  if (!url || !url.startsWith('/api/uploads/')) return null;
  const parts = url.slice('/api/uploads/'.length).split('?')[0].split('/');
  if (parts.length !== 2) return null;
  const [folder, filename] = parts;
  if (!isAllowedFolder(folder) || !isSafeFilename(filename)) return null;
  return { folder, filename };
}

/** Deletes a MongoDB-stored upload. External URLs and legacy paths are ignored. */
export async function deleteStoredUploadByUrl(url: string): Promise<boolean> {
  const parsed = parseUploadUrl(url);
  if (!parsed) return false;
  try {
    await connectDB();
    const res = await StoredUpload.deleteOne(parsed);
    return res.deletedCount > 0;
  } catch (err) {
    console.error('Failed to delete stored upload:', err);
    return false;
  }
}

/** Deletes every stored upload that was in `before` but is no longer referenced in `after`. */
export async function deleteRemovedUploads(before: string[], after: string[]): Promise<void> {
  const keep = new Set(after.filter(Boolean));
  const removed = before.filter((u) => u && !keep.has(u));
  await Promise.all(removed.map((u) => deleteStoredUploadByUrl(u)));
}
