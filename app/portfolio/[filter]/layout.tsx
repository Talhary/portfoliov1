import { PortfolioNavbar } from "@/components/portfolio-navbar"
import { Loader2 } from "lucide-react";
import { Suspense } from 'react';
const Layout = ({children, params: { filter }}:{params:{filter:string},children:React.ReactNode})=>{
   
   return <div>
         <Suspense fallback ={<>
             <Loader2 className="animate-spin h-10 w-10 max-md:h-5 max-md:w-5 dark:text-white"/>
            </>}>
            <PortfolioNavbar filter={filter} />
         </Suspense>
       {['all', 'websites', 'webapps', 'frontend', 'backend'].indexOf(filter)===-1 ? <dialog open className="bg-rose-500 text-black text-4xl text-center items-center flex justify-center rounded-xl w-full h-[30vh]">
       Page Not Found
       </dialog>: <div>
       {children}
        </div>}
        
    </div>
}
export default Layout