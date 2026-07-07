import React from "react";
import { MdOutlineMarkEmailRead, MdOutlinePhoneInTalk } from "react-icons/md";
import { SlCalender, SlLocationPin, SlFlag } from "react-icons/sl";
import { AiFillGithub, AiFillLinkedin, AiFillHeart } from "react-icons/ai";
import { BiGlobe } from "react-icons/bi";
import AsideImageSection from '@/components/aside-image-section';
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="max-md:px-10 max-sm:px-10 navbar text-center dark:text-white max-md:py-5 text-black  backdrop-blur-sm  dark:bg-[#1e1e1e]">
        <AsideImageSection className='max-md:hidden'/>
      <hr className="my-10 max-md:hidden"></hr>
      <div className="flex flex-col items-start justify-center">
      {[
        { h: "EMAIL", p: "mtalhamaths@gmail.com", Logo: <MdOutlineMarkEmailRead  size={25} color="orange" />, url: "mailto:mtalhamaths@gmail.com" },
        { h: "PHONE", p: "+92 318 5853847", Logo: <MdOutlinePhoneInTalk  size={25} color="orange" />, url: "tel:+923185853847" },
        { h: "BIRTH", p: "28 Nov 2003", Logo: <SlCalender  size={25} color="orange" /> },
        { h: "LOCATION", p: "Islamabad, Pakistan", Logo: <SlLocationPin size={25} color="orange" /> },
        { h: "NATIONALITY", p: "Pakistani", Logo: <SlFlag size={25} color="orange" /> },
        { h: "LANGUAGES", p: "English, Urdu", Logo: <BiGlobe size={25} color="orange" /> },
        { h: "GITHUB", p: "github.com/talhary", Logo: <AiFillGithub size={25} color="orange" />, url: "https://github.com/talhary" },
      ].map(
        ({ h, p, Logo, url }, i) => {
          const content = (
            <div className="flex flex-col items-start m-3 ">
              <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">{h}</h3>
              <p className="font-semibold text-zinc-800 dark:text-white break-all rounded-md text-sm dark:bg-[#292828] bg-zinc-100 border border-zinc-200 dark:border-none p-1 px-2">{p}</p>
            </div>
          );
          return (
            <div key={i} className="flex items-center w-full">
              <div className="rounded-md dark:bg-[#292828] p-3 bg-zinc-100 border border-zinc-200 dark:border-none">
                {Logo}
              </div>
              {url ? (
                <a href={url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity flex-1 text-left">
                  {content}
                </a>
              ) : (
                content
              )}
            </div>
          );
        }
      )}
      </div>
      <div className="mt-8 pt-4 border-t border-zinc-200/10 w-full text-center">
        <Link href="/privacy" className="text-xs text-zinc-500 hover:text-primary transition-colors hover:underline">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};
export default Navbar;