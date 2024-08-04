import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Aside from "@/components/aside";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body className={`${inter.className} flex flex-row gap-x-10 `} >
         <aside className=" bg-[#1e1e1e] max-w-[24rem] m-10 rounded-xl mr-0  p-5 h-auto max-md:hidden">
           <Aside  />
         </aside>
        <div className='flex-auto max-md:ml-10'>
          {children}
        </div>
      </body>
    </html>
  );
}
