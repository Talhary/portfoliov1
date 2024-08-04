
import { Heading } from '@/components/heading';
import {Navbar} from '@/components/navbar'
import { SiMaterialdesign } from 'react-icons/si';
import AsideImageSection from '@/components/aside-image-section'
const Page = () => {

  return (
    <>
        <div>
         <Heading title="About"/>
          <AsideImageSection className='md:hidden m-2 flex flex-start flex-col items-start'/>
         <div className='mt-4 mx-2'>
         
            <div className='tracking-wide leading-relaxed '>
              <p className='text-xl opacity-70'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore repudiandae accusantium adipisci, officiis sint perferendis quis deleniti atque harum fugiat similique hic reiciendis delectus ad quidem quas facilis, nobis molestias.</p>
              <p className='text-xl opacity-70 mt-3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore repudiandae accusantium adipisci, officiis sint perferendis quis deleniti atque harum fugiat similique hic reiciendis delectus ad quidem quas facilis, nobis molestias. Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde vitae, perspiciatis fugit velit id dicta nam. Quia ullam minus fugit molestias autem accusantium tenetur voluptate ratione nulla distinctio, corporis enim!</p>
            </div>
         </div>
          <div>
             <h2 className='text-2xl font-semibold mx-3  mt-10'>What I&apos;m Doing</h2>
          </div>
          <div className='flex flex-wrap mt-4 '>
            {[1,2,3].map((el,i)=>{
              return <div key={i} className='bg-[#222224] max-md:gap-y-2 max-sm:flex-col flex flex-row gap-x-4 rounded-2xl m-3 max-sm:m-2 max-w-md shadow-sm shadow-gray-800 p-4 max-sm:p-2 px-7'>
                     <div className='flex items-start my-2 text-center max-sm:items-center '>
                       <SiMaterialdesign className='text-primary max-sm:size-9' size={30} />
                      </div>
                      <div className='space-y-'>
                        <h2 className='font-semibold text-xl r'>web design</h2>
                        <p>Thr Most modern and high-quality design made a professional level</p>
                      </div> 
              </div>
            })}
          </div>
     </div>
    </>
  );
};
export default Page;
