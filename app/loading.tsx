import { Loader2 } from "lucide-react"


const Loading =  ()=>{
    return <div className="flex-col text-center h-[100vh] flex items-center justify-center ">
      
      <Loader2 className='animate-spin h-10 w-10 max-md:h-5 max-md:w-5 dark:text-white' />
    </div>
}
export default Loading 