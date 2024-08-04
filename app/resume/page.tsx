import { IoBookOutline } from "react-icons/io5";
import {Navbar} from '@/components/navbar'
import {EducationList} from '@/components/education'
import { Slider } from "@/components/ui/slider";
import { Heading } from "@/components/heading";
const Page = () => {

  return (
    <>
      <div className=" bg-big-card relative ml-0 text-white m-10 rounded-2xl p-5 ">
        <Navbar />
       
        <Heading title="Resume"/>

      <div className="mx-7 mt-12">
      <div className="flex gap-x-6 items-center justify-start my-8">
          <IoBookOutline size={30} className="text-primary"/>
          <h1 className='text-4xl font-semibold max-md:text-2xl  after:bg-primary '> Education</h1>
        </div>

        <div>
           <EducationList/>
        </div>

      </div>
      <div className='mt-4 mx-2 text-white'>
           <h1 className='text-2xl font-semibold  after:bg-primary '> My Skills</h1>
          
      </div>
      <div className='border-card-bg-1  flex  bg-card-bg-2  flex-col space-y-10 gap-x-4 rounded-2xl m-3  shadow-sm shadow-gray-800 p-4 py-10 px-7'>
        {[{value:70,title:'MERN Stack'},{value:80,title:'Next Js'},{value:70,title:'PHP'}].map((el,i)=>(
          <div key={i} className="space-y-3">
            <h2 className="text-xl max-md:text-lg max-sm:text-md"><span className=" font-semibold">{el.title}</span> <span>{el.value}{"%"}</span> </h2>
            <Slider
              defaultValue={[el.value]}
              className='w-full'
              disabled
           />
          </div>
        ))}
      </div>
     </div>
   
    </>
  );
};

export default Page;
