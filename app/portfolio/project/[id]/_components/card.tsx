
// Import necessary components and icons
import { Card } from "@/components/ui/card";
// Assuming Shadcn Card
import { Separator } from "@/components/ui/separator";
// Assuming Shadcn Separator
import Link from "next/link";
// Next.js Link component
import { formSchema } from '@/lib/form-type';
// Your Zod schema definition
import * as z from 'zod';
// Zod for type inference
import { ImageCarousel } from '@/app/admin/dashboard/image-Carosal';
// Your image carousel component

// Import icons from lucide-react (commonly used with Shadcn UI)
import { Folder, Link as LinkIcon, CalendarDays, Github } from "lucide-react";


// Use the inferred type from your Zod schema for the component's props
export default function Component(obj: z.infer<typeof formSchema>) {


  // Helper function to display clean URLs (removes https/http and www)
  const cleanUrl = (url: string): string => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      let hostname = urlObj.hostname;
      if (hostname.startsWith('www.')) {
        hostname = hostname.substring(4);
      }
      const path = urlObj.pathname === '/' ? '' : urlObj.pathname.replace(/\/$/, '');
      return `${hostname}${path}`;
    } catch (error) {
      return url;
      // Fallback to original if invalid URL
    }
  };


  // Helper function specifically for cleaning GitHub URLs
  const cleanGithubUrl = (url: string): string => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'github.com') {
        return 'github.com/' + urlObj.pathname.substring(1).replace(/\/$/, '');
      }
      return cleanUrl(url);
      // Fallback to generic cleaner if not a standard github.com URL
    } catch (error) {
      return url;
      // Fallback to original if invalid URL
    }
  };


  const createdDate = "April 15, 2023";
  const updatedDate = "September 25, 2024";


  return (

    <Card className="w-full p-6 flex flex-row max-md:flex-col gap-6 dark:border-gray-600 rounded-lg shadow-lg bg-transparent max-md:max-w-md text-white dark:bg-transparent dark:text-foreground">
      <div className="space-y-5 h-full">



        <div className="flex items-center gap-4 ">


          <div className="bg-primary rounded-md p-3 flex items-center justify-center shrink-0">
            <Folder className="w-6 h-6 text-primary-foreground" />
          </div>

          <div className="grid gap-1 flex-grow">

            <h3 className="text-xl font-semibold text-white dark:text-foreground">{obj.title}</h3>

            <p className="text-sm text-white dark:text-muted-foreground">{obj.type.split('|')[0]}</p>
          </div>
        </div>


        <Separator />


        <div className="grid gap-4">

          {obj.imageUrl && Array.isArray(obj.imageUrl) && obj.imageUrl.length > 0 && (
            <ImageCarousel images={obj.imageUrl} />
          )}



        </div>



      </div>
      <Separator orientation="vertical" className="h-" />

      <div className="flex flex-col h-full items-stretch justify-center space-y-4  gap-2 text-sm text-white dark:text-muted-foreground">
        {/* Description */}
        {obj.description && (
          <div className="text-lg max-md:text-sm">
            {obj.description}
          </div>
        )}

        <Separator />

        {/* Link */}
        {obj.link && (
          <div className="flex items-center gap-2">
            <LinkIcon className="w-7 h-7 shrink-0" />
            <Link
              href={obj.link}
              className="hover:underline truncate"
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
            >
              {cleanUrl(obj.link)}
            </Link>
          </div>
        )}

        {/* Created Date */}
        <div className="flex items-center gap-2">
          <CalendarDays className="w-7 h-7 shrink-0" />
          <span>Created: {createdDate}</span>
        </div>

        {/* Updated Date */}
        <div className="flex items-center gap-2">
          <CalendarDays className="w-7 h-7 shrink-0" />
          <span>Updated: {updatedDate}</span>
        </div>

        {/* GitHub Link */}
        {obj.githubUrl && (
          <div className="flex items-center gap-2">
            <Github className="w-7 h-7 shrink-0" />
            <Link
              href={obj.githubUrl}
              className="hover:underline truncate"
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
            >
              {cleanGithubUrl(obj.githubUrl)}
            </Link>
          </div>
        )}
      </div>





    </Card>
  );
}


// Removed the inline SVG icon functions below as they are replaced by imports from lucide-react.

// Delete these functions from your file:

// function CalendarDaysIcon(props:any) { ... }

// function FolderIcon(props:any) { ... }

// function GithubIcon(props:any) { ... }

// function LinkIcon(props:any) { ... }