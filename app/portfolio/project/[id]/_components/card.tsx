
import { Card } from "@/components/ui/card"
import Link from "next/link"
import {formSchema} from '@/lib/form-type'
import * as z from 'zod'
import { ImageCarousel } from '@/app/admin/dashboard/image-Carosal'
export default function Component(obj:z.infer<typeof formSchema>  ) {
  return (
    
    <Card className="w-full max-w-md mx-auto  bg-opacity-20 p-6 grid gap-6">
      
      <div className="grid gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary rounded-md p-3 flex items-center justify-center">
            <FolderIcon className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="grid gap-1">
            <h3 className="text-xl font-semibold">{obj.title}</h3>
            <p className="text-muted-foreground">{obj.type.split('|')[0]}</p>
          </div>
        </div>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            <Link href={obj.link} className="hover:underline" prefetch={false}>
              {obj.link.split('https://')[1].split('/').join('')}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="w-4 h-4" />
            <span>Created: April 15, 2023</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="w-4 h-4" />
            <span>Updated: September 25, 2024</span>
          </div>
          <div className="flex items-center gap-2">
            <GithubIcon className="w-4 h-4" />
            <Link href={obj.githubUrl} className="hover:underline" prefetch={false}>
              {obj.githubUrl.split('https://')[1]}
            </Link>
          </div>
        </div>
      </div>
      <div className="grid gap-4">
        <ImageCarousel images={obj.imageUrl}/>
        <div className="text-sm text-muted-foreground">
          {obj.description}
        </div>
      </div>
    </Card>
  )
}

function CalendarDaysIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  )
}


function FolderIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  )
}


function GithubIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}


function LinkIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}