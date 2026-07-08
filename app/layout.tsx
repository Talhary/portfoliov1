import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import Aside from "@/components/aside";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider"
import { GetToTopButton } from "@/components/get-to-top";
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
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body className={`${inter.className}  flex flex-row  max-md:flex-col-reverse `} >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <aside className="py-10 z-10 bg-zinc-50 dark:bg-[#1e1e1e] text-zinc-900 dark:text-white border border-zinc-200 dark:border-none shadow-sm dark:shadow-black w-full md:w-[20rem] md:min-w-[20rem] md:max-w-[20rem] max-md:max-w-full rounded-xl mr-0 p-5 h-auto max-md:p-0 max-md:m-0 md:sticky md:top-0 md:h-screen md:overflow-y-auto custom-scrollbar">
            <div className=" ">
              <Aside />
            </div>

          </aside>
          <div className='flex-auto max-md:ml-0 relative min-w-0 max-w-full overflow-hidden'>
            <Navbar className='z-50' />
            <div className="bg-zinc-50 dark:bg-big-card border border-zinc-200 dark:border-none shadow-sm dark:shadow-black relative ml-0 text-zinc-900 dark:text-zinc-100 max-md:m-4 max-xs:m-1 max-xs:p-3 rounded-2xl p-5 max-md:p-3 w-full max-w-full overflow-hidden">
              <GetToTopButton />
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
