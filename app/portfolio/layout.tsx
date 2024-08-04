import { Heading } from "@/components/heading"
import { Navbar } from "@/components/navbar"
import { PortfolioNavbar } from "@/components/portfolio-navbar"


const RootLayout = ({children }:{children:React.ReactNode})=>{
   
    return <div className="bg-big-card relative ml-0 text-white m-10 rounded-2xl p-5 ">
          <Navbar />
          <Heading title="Portfolio"/>
          {children}
         
    </div>
}
export default RootLayout
