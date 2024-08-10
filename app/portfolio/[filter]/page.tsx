import {AllProjects} from '@/components/all-projects'
import { GetAllProjects } from "@/actions/getAllProjects";
const Page =async ({ params: { filter }}: { params: { filter: string }}) => {
 const res = await GetAllProjects(filter);
 
  if(filter == 'all') return <div>
    <AllProjects projects={res} />
  </div>
 const data = res.filter((el:any)=>el.type.split('|').indexOf(filter) != -1)

    return (
        <div>
          
    <AllProjects projects={data} />
        </div>
    );
}
export default Page;
