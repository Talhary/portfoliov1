'use server'
import {formSchema} from '@/lib/form-type'
import {z} from 'zod'
import {db} from '@/lib/db'
export const AddProject = async(res:z.infer<typeof formSchema>)=>{
  try{
    const parse = formSchema.safeParse(res)
    if(!parse.success){
      return {status:400,data:"failed to parse"}
    }
    const data = await db.projects.create({
        data:res
    })
    return {status:201,data}
  }catch(e:any){
    console.log(e);
    return {status:500,data:e}
  }
}