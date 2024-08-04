import { Heading } from "@/components/heading"
import { Navbar } from "@/components/navbar"
import { PortfolioNavbar } from "@/components/portfolio-navbar"


const RootLayout = ({children }:{children:React.ReactNode})=>{
   
    return  <div>
          <Navbar />
          <Heading title="Portfolio"/>
          {children}
         
    </div>
}
export default RootLayout
