
import { Heading } from '@/components/heading';
import { Navbar } from '@/components/navbar'
import { SiMaterialdesign } from 'react-icons/si';
import AsideImageSection from '@/components/aside-image-section'
const Page = () => {

  return (
    <>
      <div className='max-md:px-0 dark:text-white'>
        <Heading title="About" />
        <AsideImageSection className='md:hidden m-2 flex  flex-col items-start justify-center' />
        <div className='mt-4 mx-2 '>

          <div className='tracking-wide leading-relaxed text-white'>
            <p className='text-xl opacity-70 '> My name is Talha. I am a full stack web developer. I can create web
              apps and bots with different technologies and Libraries. I  completed
              my Graduation and now I am looking for job opportunities.</p>
          </div>
        </div>
        <div>
          <h2 className='text-2xl font-semibold mx-3  mt-10'>What I&apos;m Doing</h2>
        </div>
        <div className='flex flex-wrap mt-4 '>
          {[
            { title: 'MERN STACK', text: 'I can create full stack web apps with MongoDb, Express, React & NodeJs' },
            { title: 'NEXT Js', text: 'I can use NEXT Js to create full stack web apps & websites.' },
            { title: 'Vanilla Js', text: 'Using vanilla Js with HTML & Css I can create front end websites.' },
          ].map((el, i) => {
            return <div key={i} className='card  max-md:gap-y-2 max-sm:flex-col flex flex-row gap-x-4 rounded-2xl m-3 max-sm:m-2 max-w-md  shadow-black dark:shadow-gray-800 p-4 max-sm:px-3 max-sm:py-4 px-7'>
              <div className='flex items-start my-2 text-center max-sm:items-center '>
                <SiMaterialdesign className='text-primary max-sm:size-9' size={30} />
              </div>
              <div className='space-y-'>
                <h2 className='font-semibold `text-xl r'>{el.title}</h2>
                <p>{el.text}</p>
              </div>
            </div>
          })}
        </div>
        <div>
          <h2 className='text-2xl font-semibold mx-3  mt-10'>Experience</h2>
        </div>
        <div className='flex flex-wrap mt-4 '>
          {[
            { title: 'Web Developer', text: 'I have done Internship at Swismax Solutions.' },
          ].map((el, i) => {
            return <div key={i} className='card  max-md:gap-y-2 max-sm:flex-col flex flex-row gap-x-4 rounded-2xl m-3 max-sm:m-2 max-w-md  shadow-black dark:shadow-gray-800 p-4 max-sm:px-3 max-sm:py-4 px-7'>
              <div className='flex items-start my-2 text-center max-sm:items-center '>
                <SiMaterialdesign className='text-primary max-sm:size-9' size={30} />
              </div>
              <div className='space-y-'>
                <h2 className='font-semibold `text-xl r'>{el.title}</h2>
                <p>{el.text}</p>
              </div>
            </div>
          })}
        </div>
      </div>
    </>
  );
};
export default Page;
