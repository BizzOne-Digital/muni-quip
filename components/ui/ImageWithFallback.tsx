'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError' | 'src'> {
  src?: string | null;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23263540"/%3E%3Cpath d="M170 175l25-30 20 22 15-16 30 34H150z" fill="%23415466"/%3E%3Ccircle cx="180" cy="125" r="10" fill="%23415466"/%3E%3C/svg%3E';

/**
 * next/image wrapper that never breaks the page:
 * - empty src renders the fallback
 * - legacy `/uploads/...` paths (lost after serverless deploys) fall back on error
 * - any failing remote or `/api/uploads/...` image falls back on error
 */
export default function ImageWithFallback({ src, fallbackSrc = DEFAULT_FALLBACK, alt, ...props }: ImageWithFallbackProps) {
  const wanted = src && src.trim() ? src : fallbackSrc;
  // Remember which src failed; a new src prop automatically gets a fresh attempt.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imgSrc = failedSrc === wanted ? fallbackSrc : wanted;
  const isFallback = imgSrc === fallbackSrc;
  const isLegacy = imgSrc.startsWith('/uploads/');

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      unoptimized={isFallback || isLegacy || imgSrc.startsWith('data:')}
      onError={() => {
        if (!isFallback) setFailedSrc(wanted);
      }}
    />
  );
}
