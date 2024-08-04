import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Aside from "@/components/aside";
import { Navbar } from "@/components/navbar";

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
      <body className={`${inter.className} flex flex-row gap-x-10 max-md:flex-col-reverse `} >
         <aside className=" z-10 bg-[#1e1e1e] max-w-[24rem] max-md:max-w-full m-10 rounded-xl mr-0  p-5 h-auto   max-md:p-0 max-md:m-0">
            <div className=" ">
             <Aside  />
            </div>
           
         </aside>
        <div className='flex-auto max-md:ml-0 '>
        <div className= "  bg-big-card relative ml-0 text-white m-10  max-md:m-7 max-xs:m-4 max-xs:p-3 rounded-2xl p-5 max-md:p-3 ">
         <Navbar className='z-10'/>
          {children}
          </div>
        </div>
      </body>
    </html>
  );
}
