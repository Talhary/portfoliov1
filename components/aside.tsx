import Image from "next/image";
import Link from "next/link";
import Logo from "@/design/logo.jpg";
import React from "react";
import { MdOutlineMarkEmailRead, MdOutlinePhoneInTalk } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
const Navbar = () => {
  return (
    <div className=" navbar text-center text-white  bg-[#1e1e1e]">
      <div className="bg-[#32312f] p-1 w-[70%] mx-auto my-4 rounded-xl">
        <Image
          className="mx-auto  my-[20%]"
          src={Logo}
          alt="Logo"
          width={100}
          height={100}
        />
      </div>
      <div>
        <h1 className="text-3xl my-4 ">Talha Riaz</h1>
        <p className="bg-[#32312f] my-2 w-[70%] p-1 rounded-md mx-auto">
          <span className='text-primary'>W</span>eb Developer
        </p>
      </div>
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
