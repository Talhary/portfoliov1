'use server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const LoginUser = async(email:string,password:string)=>{
    console.log({email,password})
    if(!process.env.JWT_TOKEN) return {success:false,message:'JWT Token missing'}
    if(!email || ! password) return {success:false,message:'Please provide email and passord',token:null}
    if(email ==process.env.GMAIL && password==process.env.GMAIL_PASS){
        let token =  jwt.sign({email:email,password:password},process.env.JWT_TOKEN );
        const cookieStore = await cookies();
        cookieStore.set('token', token as string);
       
       redirect('/admin/dashboard')  
       return {success:true,message:'Loggen in'} 

    }
    return {success:false,message:'Invalid Credentials'}
    
}