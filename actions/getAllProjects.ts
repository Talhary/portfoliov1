import { db } from "@/lib/db";

export const GetAllProjects = async(filter?:string)=>{
    const res = await db.projects.findMany();
    
    return res
}