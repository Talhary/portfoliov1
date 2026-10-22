import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import { ThemeProvider } from "@/components/theme-provider"
import { SmoothScroll } from "@/components/smooth-scroll";
import { themeColors, hexToRgb } from "@/lib/colors";
import LayoutWrapper from "@/components/layout-wrapper";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://talhacodes.site";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "talhacodes | High-Performance Software Engineering & Developer Tools",
    template: "%s | talhacodes",
  },
  description: "Muhammad Talha (talhacodes) is a software engineer based in Islamabad. Creator of Noyare (forensic system monitor for Windows), scalable web architectures, and high-performance developer tools.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: [
      "wHIxtQ2Ehw-Z4mysz4nMFthsRdGwaCmbnp72t9r7mkI",
      "6T7Bjp5t8IbCIRz0m8tBXAwsUrieJPo__M6ZGbdPTLA"
    ],
  },
  other: {
    "google-adsense-account": "ca-pub-5705856509590868",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cssVariables = `
    :root {
      --primary: ${themeColors.primary};
      --primary-hover: ${themeColors.primaryHover};
      --primary-rgb: ${hexToRgb(themeColors.primary)};
      --big-card: ${themeColors.bigCard};
      --card-bg: ${themeColors.cardBg};
      --card-light-bg: ${themeColors.cardLightBg};
      --card-bg-1: ${themeColors.cardBg1};
      --card-bg-2: ${themeColors.cardBg2};
      --card-bg-3: ${themeColors.cardBg3};
      --slider-bg: ${themeColors.sliderBg};
    }
  `;

  return (
    <html lang="en" className="" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased selection:bg-primary/20 selection:text-primary`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
