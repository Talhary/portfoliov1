'use server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const LoginUser = async(email:string,password:string)=>{
    console.log({email,password})
    if(!email || ! password) return {success:false,message:'Please provide email and passord',token:null}
    if(email =='talha@gmail.com' && password=='password'){
        let token =  jwt.sign({email:email,password:password},'This is sdjfklsdjfklj3jskldjkjk');
        cookies().set('token', token as string)
       
       redirect('/admin/dashboard')  
       return {success:true,message:'Loggen in'} 

    }
    return {success:false,message:'Invalid Credentials'}
    
}