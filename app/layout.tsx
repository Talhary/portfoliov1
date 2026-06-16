import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Aside from "@/components/aside";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider"
import { GetToTopButton } from "@/components/get-to-top";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Talha Riaz ",
  description: "Muhammad Talha Riaz, Full Stack Software Engineer Portfolio.",
  verification: {
    google: "wHIxtQ2Ehw-Z4mysz4nMFthsRdGwaCmbnp72t9r7mkI",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <head>
        <meta name="monetag" content="d616d4263288da82128beeeb51cf9327" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5705856509590868"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className}  flex flex-row  max-md:flex-col-reverse `} >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <aside className="py-10 z-10 dark:bg-[#1e1e1e] dark:text-white text-black shadow shadow-black backdrop-blur-2xl w-full md:w-[20rem] md:min-w-[20rem] md:max-w-[20rem] max-md:max-w-full rounded-xl mr-0 p-5 h-auto max-md:p-0 max-md:m-0 md:sticky md:top-0 md:h-screen md:overflow-y-auto custom-scrollbar">
            <div className=" ">
              <Aside />
            </div>

          </aside>
          <div className='flex-auto  max-md:ml-0 relative'>
            <Navbar className='z-50' />
            <div className="  dark:bg-big-card  dark:text-black  shadow shadow-black backdrop-blur-2xl relative ml-0 text-white   max-md:m-4 max-xs:m-1 max-xs:p-3 rounded-2xl p-5 max-md:p-3 ">
              <GetToTopButton />
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>

    </html>
  );
}
