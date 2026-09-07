import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Developer Tools & Utilities | Talha Codes',
  description: 'Explore 140+ high-performance online developer tools, converters, encoders, formatters, network analyzers, and system utilities.',
  alternates: {
    canonical: '/tools',
  },
  openGraph: {
    title: 'Free Online Developer Tools & Utilities | Talha Codes',
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
