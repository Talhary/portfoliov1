import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import { ThemeProvider } from "@/components/theme-provider"
import { SmoothScroll } from "@/components/smooth-scroll";
import { themeColors, hexToRgb } from "@/lib/colors";
import LayoutWrapper from "@/components/layout-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Talha Codes",
  description: "Talha Codes - Full Stack Software Engineer Portfolio.",
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
      <body className={`${inter.className}  flex flex-row  max-md:flex-col-reverse `} >
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
