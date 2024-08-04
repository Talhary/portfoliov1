import Image from "next/image";

import Logo from "@/design/logo.jpg";
const Section = ({className}:{className?:string})=>{
    return <div className={className}>
        <div className={` bg-[#32312f] p-1 md:w-[70%] md:mx-auto md:my-4 rounded-xl `}>
        <Image
          className="mx-auto  my-[20%]"
          src={Logo}
          alt="Logo"
          width={100}
          height={100}
        />
      </div>
      <div>
        <h1 className="text-3xl md:my-4 ">Talha Riaz</h1>
        <p className="bg-[#32312f] my-2 md:w-[70%]  p-1 rounded-md md:mx-auto">
          <span className='text-primary'>W</span>eb Developer
        </p>
      </div>
    </div>
}
export default Section