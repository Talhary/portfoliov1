import Image from "next/image";

import Logo from "@/images/me.png";
const Section = ({ className }: { className?: string }) => {
  return <div className={`${className} sidebar-image-section`}>
    <div className={`dark:bg-card-bg dark:text-black text-white p-1 md:w-[70%] md:mx-auto md:my-4 rounded-xl sidebar-image-box`}>
      <Image
        className="mx-auto  md:my-[20%] "
        src={Logo}
        alt="Logo"
        width={200}
        height={200}
      />
    </div>
    <div>
      <h1 className="text-3xl max-md:my-5 md:my-4 max-md:text-4xl text-zinc-900 dark:text-white font-bold tracking-tighter sidebar-name">Talha Codes</h1>
      <p className="dark:bg-card-bg bg-zinc-100 text-xl my-2 md:w-fit p-1.5 px-3 rounded-md md:mx-auto text-zinc-850 dark:text-white border border-zinc-200 dark:border-none sidebar-title">
        <span className='text-primary '>S</span>oftware Engineer
      </p>
    </div>
  </div>
}
export default Section