import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Aside from "@/components/aside";
import { Navbar } from "@/components/navbar";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ThemeProvider } from "@/components/theme-provider"

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { GetToTopButton } from "@/components/get-to-top";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Talha Riaz ",
  description: "Muhammad Talha Riaz, Full Stack Web developer Portfolio.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="" suppressHydrationWarning>

      <body className={`${inter.className}  flex flex-row gap-x-10 w-screen max-w-screen max-md:flex-col-reverse `} >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <aside className="py-10 z-10 dark:bg-[#1e1e1e] dark:text-white text-black shadow shadow-black backdrop-blur-2xl   max-w-[27rem] max-md:max-w-full m-10 rounded-xl mr-0  p-5 h-auto   max-md:p-0 max-md:m-0">
            <div className=" ">
              <Aside />
            </div>

          </aside>
          <div className='flex-auto max-md:ml-0 '>
            <div className="   dark:bg-big-card  dark:text-black  shadow shadow-black backdrop-blur-2xl relative ml-0 text-white m-10  max-md:m-4 max-xs:m-1 max-xs:p-3 rounded-2xl p-5 max-md:p-3 ">
              <GetToTopButton/>
              <Navbar className='z-10' />
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>

    </html>
  );
}
