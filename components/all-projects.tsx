import Image from 'next/image'
import { z } from 'zod'
import { formSchema } from "@/lib/form-type"
import { ImageCarousel } from '@/app/admin/dashboard/image-Carosal'
export const AllProjects = ({ projects }: { projects: z.infer<typeof formSchema>[] }) => {

  return <div className='flex overflow-hidden items-start lg:justify-start  max-lg:justify-center  flex-wrap gap-3  mt-3 max-md:gap-2 '>
    {projects.map((project: z.infer<typeof formSchema>, i: any) => {
      return <div key={project.link} className="max-h-lg my-3 w-[20rem]   max-md:my-1  bg-white bg-opacity-10 dark:bg-card-bg dark:bg-opacity-100 card shadow-lg rounded-lg overflow-hidden max-w-sm ">
        <div className="relative h-48 overflow-hidden">
          <ImageCarousel images={project.imageUrl} />
        </div>
        <div className="p-4 max-md:p-3 max-sm:p-2 ">
          <h2 className="text-xl font-semibold dark:text-white text-white">{project.title}</h2>
          <div className="mt-2 max-md:mt-1 ">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary dark:text-black text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              View Project
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 inline-block border border-white  py-2 px-4 dark:text-white text-white hover:border-black hover:text-blue-500 transition-colors"
            >
              Details
            </a>
          </div>
        </div>
      </div>
    })}

  </div>
}