import { IoBookOutline } from "react-icons/io5";
import { FaReact, FaNodeJs, FaPhp, FaDocker } from "react-icons/fa";
import { SiNextdotjs, SiExpress, SiDeno, SiTypescript, SiJavascript, SiMongodb, SiMysql, SiPostgresql, SiUbuntu } from "react-icons/si";

import { EducationList } from '@/components/education'
import { Slider } from "@/components/ui/slider";
import { Heading } from "@/components/heading";
const skills = [
  // Added 'value' property with percentage
  { name: 'Next.js', value: 80, icon: SiNextdotjs, color: 'bg-black text-white', darkColor: 'dark:bg-black dark:text-white' }, // Special case for Next.js logo
  { name: 'React', value: 90, icon: FaReact, color: 'bg-sky-900 text-sky-300', darkColor: 'dark:bg-sky-900 dark:text-sky-300' },
  { name: 'Node.js', value: 99, icon: FaNodeJs, color: 'bg-green-900 text-green-300', darkColor: 'dark:bg-green-900 dark:text-green-300' },
  { name: 'Express', value: 80, icon: SiExpress, color: 'bg-neutral-700 text-neutral-300', darkColor: 'dark:bg-neutral-700 dark:text-neutral-200' },
  { name: 'Deno', value: 70, icon: SiDeno, color: 'bg-neutral-700 text-neutral-300', darkColor: 'dark:bg-neutral-700 dark:text-neutral-200' },
  { name: 'TypeScript', value: 85, icon: SiTypescript, color: 'bg-blue-700 text-blue-300', darkColor: 'dark:bg-blue-900 dark:text-blue-300' },
  { name: 'JavaScript', value: 90, icon: SiJavascript, color: 'bg-yellow-700 text-yellow-300', darkColor: 'dark:bg-yellow-900 dark:text-yellow-300' },
  { name: 'PHP', value: 80, icon: FaPhp, color: 'bg-indigo-700 text-indigo-300', darkColor: 'dark:bg-indigo-900 dark:text-indigo-300' },
  { name: 'MongoDB', value: 80, icon: SiMongodb, color: 'bg-emerald-700 text-emerald-300', darkColor: 'dark:bg-emerald-900 dark:text-emerald-300' },
  { name: 'MySQL', value: 75, icon: SiMysql, color: 'bg-orange-700 text-orange-300', darkColor: 'dark:bg-orange-900 dark:text-orange-300' },
  { name: 'PostgreSQL', value: 80, icon: SiPostgresql, color: 'bg-cyan-700 text-cyan-300', darkColor: 'dark:bg-cyan-900 dark:text-cyan-300' },
  { name: 'Docker', value: 65, icon: FaDocker, color: 'bg-blue-200 text-blue-900', darkColor: 'dark:bg-blue-800 dark:text-blue-200' },
  { name: 'Ubuntu', value: 70, icon: SiUbuntu, color: 'bg-red-700 text-red-300', darkColor: 'dark:bg-red-900 dark:text-red-300' },
];
const Page = () => {

  return (
    <>
      <div>

        <Heading title="Resume" />

        <div className="mx-7 mt-12 max-md:mx-6 max-xs:mx-3">
          <div className="flex gap-x-6 items-center justify-start my-8 max-md:my-6 max-xs:my-4 max-md:gap-x-4 max-xs:gap-x-3">
            <IoBookOutline size={30} className="text-primary max-xs:size-6  max-md:size-7" />
            <h1 className='text-4xl font-semibold max-md:text-2xl  after:bg-primary dark:text-white'> Education</h1>
          </div>

          <div>
            <EducationList />
          </div>

        </div>
        <div className='mt-4 mx-2 text-white'>
          <h1 className='text-2xl font-semibold  after:bg-primary '> My Skills</h1>

        </div>
        <div className='border-card-bg-1 mt-6 card hover:scale-[1.007] flex dark:bg-card-bg-2 bg-white bg-opacity-10 flex-col space-y-10 rounded-2xl m-3 shadow-sm shadow-gray-800 p-6 dark:text-white'> {/* Adjusted space-y and padding */}
  {/* Map through the new skills array */}
  {skills.map((el, i) => (
    <div key={i} className="space-y-2"> {/* Adjusted vertical space */}
      {/* Skill Title, Icon, and Percentage */}
      <div className="flex items-center justify-between">
        {/* Skill Title and Icon - using flex to align icon and text, applying text colors from data */}
        <h2 className={`text-xl max-md:text-lg max-sm:text-md flex items-center gap-x-2 ${el.color.split(' ')[1]} ${el.darkColor.split(' ')[1]}`}>
          {/* Skill Icon - applying text colors from data */}
          {el.icon && <el.icon className="shrink-0" size={20} />}
          <span className="font-semibold">{el.name}</span> {/* Using el.name */}
        </h2>
        {/* Skill Percentage - applying text colors from data */}
        <span className={`font-semibold shrink-0 ${el.color.split(' ')[1]} ${el.darkColor.split(' ')[1]}`}>{el.value}%</span> {/* Using el.value */}
      </div>

      {/* Skill Slider - applying background colors from data */}
      {/* Using arbitrary variants to apply the bg color from the skill data */}
      <Slider
        defaultValue={[el.value]}
        className={`w-full [&>span:first-child]:${el.color.split(' ')[0]} [&>span]:${el.color.split(' ')[0]} ${el.darkColor.split(' ')[0]}`} // Apply bg colors
        disabled // Assuming the slider is just for display
      />
    </div>
  ))}
</div>
      </div>

    </>
  );
};

export default Page;
