import Image from "next/image";

import Logo from "@/images/me.png";
const Section = ({className}:{className?:string})=>{
    return <div className={className}>
        <div className={` dark:bg-[#32312f] dark:text-black text-white p-1 md:w-[70%] md:mx-auto md:my-4 rounded-xl  `}>
        <Image
          className="mx-auto  md:my-[20%] "
          src={Logo}
          alt="Logo"
          width={200}
          height={200}
        />
      </div>
      <div>
        <h1 className="text-3xl max-md:my-5 md:my-4 max-md:text-4xl text-white   font-bold tracking-tighter">Talha Riaz</h1>
        <p className="dark:bg-[#32312f] bg-white bg-opacity-10 text-xl my-2 md:w-fit  p-1 rounded-md md:mx-auto md:text-white  max-md:text-black-black  dark:text-white">
          <span className='text-primary '>W</span>eb Developer
        </p>
      </div>
    </div>
}
export default Section