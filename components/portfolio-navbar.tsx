
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


export const PortfolioNavbar = ({filter}:{filter:string}) => {
   
    return (
        <div>
            <ul className='w-full flex text-2xl my-8 gap-x-4 max-mid:text-lg max-lg:text-lg transition-all max-lg:gap-x-2 text-nowrap  max-md:text-sm max-md:gap-x-3'>
                {nameList.map((el, i) => (
                    
                        <li key={el} className={`tracking-lighter font-semibold ${filter == el && 'text-primary'}`}>
                            <Link href={`/portfolio/${el}`}>{list[i]}</Link>
                        </li>
                    
                ))}
            </ul>
        </div>
    );
}
