'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

// Clean Google AdSense component.
// It will load the AdSense tag only on public, content-heavy pages,
// and automatically exclude admin dashboard and utility routes to prevent policy violations.
export default function AdSense() {
  const pathname = usePathname();

  // Exclude admin dashboard, login, and redirection screens to follow Google Publisher policies
  if (pathname.startsWith('/admin') || pathname === '/loading') {
    return null;
  }

  // Retrieve the Publisher ID from environment variable or fallback to a standard configuration
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "ca-pub-wHIxtQ2Ehw-Z4mysz4nMFthsRdGwaCmbnp72t9r7mkI"; // Replace with your actual ca-pub ID

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
