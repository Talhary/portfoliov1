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
    const data = await db.projects.findFirst({
        where:{
            id:id
        }
    })
  
    return {status:200,data}
  }catch(e:any){
    console.log(e);
    return {status:500,data:e}
  }
}