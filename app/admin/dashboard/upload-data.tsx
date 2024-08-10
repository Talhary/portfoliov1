"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "@/components/ui/multi-select";
import { Input } from "@/components/ui/input"
import  {formSchema} from '@/lib/form-type'
import {AddProject} from '@/actions/addProject'
import {useState} from 'react'
import UploadButton from './Upload-btn'
import {useEffect} from'react'
export const  ProfileForm= ()=> {


  const options = [
    { label: "Website", value: "websites" },
    { label: "Web App", value: "webapps" },
    { label: "Front End", value: "frontend" },
    { label: "Backend", value: "backend" },
  ];
  const [loading,setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const[imgUrl,setImgUrl] = useState<string[]>([])
  const [value, setValue] = useState<string[]>([]);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      link: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      imageUrl: [],
      githubUrl: "",
    },
  })
useEffect(()=>{
  form.setValue('imageUrl',imgUrl)
},[imgUrl])
useEffect(()=>{
   if(value.length ==0 )return
   form.setValue('type',value.join('|'))
},[value])
  // 2. Define a submit handler.
async  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    //  This will be type-safe and validated.
  
  setLoading(true)
    try{
      const res =await AddProject(values)
      if(res.status == 201){
        setMsg('Item Added')
        window.location.reload();
        form.reset();
      }
    }
    catch(e:any){
      console.log(e)
      setMsg('Failed to add Item')
      setLoading(false)
    }
    
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg  mx-auto py-5 bg-gray-800 shadow shadow-white px-5 rounded-md m-7 ">
      <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                  <MultiSelector values={value} onValuesChange={setValue} loop={false}>
      <MultiSelectorTrigger>
        <MultiSelectorInput placeholder="Select Type" />
      </MultiSelectorTrigger>
      <MultiSelectorContent>
        <MultiSelectorList className="bg-black text-white ">
          {options.map((option:any, i:any) => {
           
           return <MultiSelectorItem key={i} value={option.value}>
              {option?.label}
            </MultiSelectorItem>
          })}
        </MultiSelectorList>
      </MultiSelectorContent>
    </MultiSelector>
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link of Project</FormLabel>
              <FormControl>
                <Input placeholder="http://..." {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="githubUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Github Url</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com///" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
           
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Image of your Project</FormLabel>
              <FormControl>
                
          
                   <UploadButton setImgUrl={setImgUrl} imgUrl={imgUrl} />
               
              </FormControl>
              <FormDescription>
                Image Url from Upload Things
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
           
        <Button type="submit" className="bg-gray-300 text-black text-lg w-full" disabled={loading}>Submit</Button>
      </form>
      {msg && <div>{msg}</div>}
    </Form>
  )
}
