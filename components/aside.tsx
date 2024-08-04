import Image from "next/image";
import Link from "next/link";
import Logo from "@/design/logo.jpg";
import React from "react";
import { MdOutlineMarkEmailRead, MdOutlinePhoneInTalk } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import AsideImageSection from '@/components/aside-image-section'
const Navbar = () => {
  return (
    <div className=" navbar text-center text-white  bg-[#1e1e1e]">
       <AsideImageSection className='max-md:hidden'/>
      <hr className="my-10"></hr>
      {[{ h: "EMAIL", p: "talharaiz@gmail.com", Logo: <MdOutlineMarkEmailRead  size={25} color="orange" /> },
      { h: "PHONE", p: "+92 318 5853847", Logo: <MdOutlinePhoneInTalk  size={25} color="orange" /> },
      { h: "BIRTH", p: "28 Nov 2003", Logo: <SlCalender  size={25} color="orange" /> }].map(
        ({ h, p, Logo }, i) => {
          return (
            <div key={i} className="flex items-center mx-auto  w-[80%]">
              <div className="rounded-md bg-[#292828] p-3">
                {Logo}
              </div>
              <div className="flex flex-col items-start m-3 ">
                <h3 className="font-light">{h}</h3>
                <p className="font-semibold text-nowrap rounded-md text-sm bg-[#292828] p-1">{p}</p>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};
export default Navbar;
