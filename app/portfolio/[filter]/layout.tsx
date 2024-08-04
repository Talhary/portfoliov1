import { PortfolioNavbar } from "@/components/portfolio-navbar"

export default ({children, params: { filter }}:{params:{filter:string},children:React.ReactNode})=>{
   
   return <div>
          <PortfolioNavbar filter={filter} />
       {['all', 'websites', 'webapps', 'frontend', 'backend'].indexOf(filter)===-1 ? <dialog open className="bg-rose-500 text-black text-4xl text-center items-center flex justify-center rounded-xl w-full h-[30vh]">
       Page Not Found
       </dialog>: <div>
       {children}
        </div>}
        
    </div>
}