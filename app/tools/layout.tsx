import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Developer Tools & Utilities | talhacodes',
  description: 'Explore 140+ high-performance online developer tools, converters, encoders, formatters, network analyzers, and system utilities by talhacodes.',
  alternates: {
    canonical: '/tools',
  },
  // Tools are kept out of Google for now; remove this to re-enable indexing.
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Free Online Developer Tools & Utilities | talhacodes',
    description: 'Explore 140+ high-performance online developer tools, converters, encoders, and utilities built for engineers.',
    url: 'https://talhacodes.site/tools',
    type: 'website',
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
