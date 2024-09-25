import {getItemFromId} from '@/actions/getItemFromId'
import Card from '@/app/portfolio/project/[id]/_components/card'
const Page =async  ({params:{id}}:{params:{id:string}})=>{
    const project = await getItemFromId(id)
    if(!project.data) return <div className='dark:text-white'>Something goes wrong please reaload the page</div>
    return <>
     <Card {...project.data}/>
    </>
}
export default Page