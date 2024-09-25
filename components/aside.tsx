
import React from "react";
import { MdOutlineMarkEmailRead, MdOutlinePhoneInTalk } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import AsideImageSection from '@/components/aside-image-section'
const Navbar = () => {
  return (
    <div className="max-md:px-10 max-sm:px-10 navbar text-center dark:text-white max-md:py-5 text-black  backdrop-blur-sm  dark:bg-[#1e1e1e]">
       <AsideImageSection className='max-md:hidden'/>
      <hr className="my-10 max-md:hidden"></hr>
      <div className="flex flex-col items-start justify-center">
      {[{ h: "EMAIL", p: "mtalhamaths@gmail.com", Logo: <MdOutlineMarkEmailRead  size={25} color="orange" /> },
      { h: "PHONE", p: "+92 318 5853847", Logo: <MdOutlinePhoneInTalk  size={25} color="orange" /> },
      { h: "BIRTH", p: "28 Nov 2003", Logo: <SlCalender  size={25} color="orange" /> }].map(
        ({ h, p, Logo }, i) => {
          return (
            <div key={i} className="flex items-center  ">
              <div className="rounded-md dark:bg-[#292828] p-3 bg-white bg-opacity-10">
                {Logo}
              </div>
              <div className="flex flex-col items-start m-3 ">
                <h3 className="font-light dark:text-dark text-white">{h}</h3>
                <p className="font-semibold dark:text-white text-white text-nowrap rounded-md text-sm dark:bg-[#292828] bg-white bg-opacity-10 p-1">{p}</p>
              </div>
            </div>
          );
        }
      )}
      </div>
    </div>
  );
};
export default Navbar;
