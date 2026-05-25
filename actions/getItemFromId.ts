'use server'
import {formSchema} from '@/lib/form-type'
import {z} from 'zod'
import {db} from '@/lib/db'

type output  =  {
    data:z.infer<typeof formSchema > | null,
    status:number
}

export const getItemFromId = async(id:string):Promise <output>=>{
  try{
    // 1. Try matching raw CUID first for complete backward compatibility
    let data = await db.projects.findFirst({
        where:{
            id:id
        }
    });

    // 2. If no direct CUID matches, perform a slug-to-title comparison
    if (!data) {
      const allProjects = await db.projects.findMany();
      const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      data = allProjects.find(p => slugify(p.title) === id) || null;
    }
  
    return {status:200,data}
  }catch(e:any){
    console.error('Error fetching project by slug/id:', e);
    return {status:500,data:null}
  }
}