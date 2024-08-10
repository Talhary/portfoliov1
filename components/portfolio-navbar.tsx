'use client'
import {motion} from 'framer-motion'
const list = ['All', 'Websites', 'Web Apps', 'Front End', 'Backend'];

 type inputType = {
    all?: string | null,
    websites?: string | null,
    webapps?: string | null,
    frontend?: string | null,
    backend?: string | null,
}

 const nameList: Array<keyof inputType> = ['all', 'websites', 'webapps', 'frontend', 'backend'];

import Link from 'next/link';
import { useState } from 'react';
import { IoFilter } from 'react-icons/io5';


export const PortfolioNavbar = ({filter}:{filter:string}) => {
   const [open,setOpen] = useState(false)
    return (
        <div className=' py-2    shadow-white z-20    bg-white bg-opacity-10 text-white rounded-2xl  inline-block px-5   '>
            <button className='xs:hidden flex flex-row gap-x-2 items-center justify-center  ' onClick={()=>setOpen(!open)}> <IoFilter size={25}/> <span className='dark:bg-card-bg  p-1 rounded-md font-semibold text-sm'>{filter.toLocaleUpperCase()}</span> </button>
            <motion.ul

            className={`  w-full flex text-2xl my-3 dark:my-5   gap-x-4 max-mid:text-lg max-lg:text-lg transition-all max-lg:gap-x-2 text-nowrap  max-md:text-sm max-md:gap-x-3 max-xs:flex-col ${open?'max-xs:block':' max-xs:hidden '} max-xs:space-y-2 max-xs:my-2`}>
                {nameList.map((el, i) => (
                    
                        <li key={el} className={`tracking-lighter font-semibold max-xs:bg-card-bg max-xs:p-1 max-xs:w-fit rounded-md ${filter == el && 'text-primary'}  `}>
                            <Link href={`/portfolio/${el}`}>{list[i]}</Link>
                        </li>
                    
                ))}
            </motion.ul>
        </div>
    );
}
