import React from "react";
import { MdOutlineMarkEmailRead, MdOutlinePhoneInTalk } from "react-icons/md";
import { SlCalender, SlLocationPin, SlFlag } from "react-icons/sl";
import { AiFillGithub, AiFillLinkedin, AiFillHeart } from "react-icons/ai";
import { BiGlobe } from "react-icons/bi";
import AsideImageSection from '@/components/aside-image-section'

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
              <h3 className="font-light dark:text-dark text-white">{h}</h3>
              <p className="font-semibold dark:text-white text-white break-all rounded-md text-sm dark:bg-[#292828] bg-white bg-opacity-10 p-1">{p}</p>
            </div>
          );
          return (
            <div key={i} className="flex items-center w-full">
              <div className="rounded-md dark:bg-[#292828] p-3 bg-white bg-opacity-10">
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
    </div>
  );
};
export default Navbar;