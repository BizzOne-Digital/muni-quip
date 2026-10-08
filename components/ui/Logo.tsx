import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  locale?: string;
  className?: string;
  size?: 'header' | 'footer';
}

// public/logo-horizontal.png is 855x200 (road icon + wordmark + tagline), built from the client logo.
const SIZES = {
  header: 'h-10 sm:h-11 lg:h-12',
  footer: 'h-12 sm:h-14',
};

export default function Logo({ locale = 'en', className = '', size = 'header' }: LogoProps) {
  return (
    <Link href={`/${locale}`} className={`inline-flex items-center flex-shrink-0 ${className}`} aria-label="MUNI-QUIP — Home">
      <Image
        src="/logo-horizontal.png"
        alt="MUNI-QUIP — Reliable Municipal Solutions"
        width={855}
        height={200}
        priority={size === 'header'}
        className={`${SIZES[size]} w-auto`}
      />
    </Link>
  );
}
