
import { Heading } from '@/components/heading';
import {Navbar} from '@/components/navbar'
const Page = () => {

  return (
    <>
      <div className="bg-big-card relative ml-0 text-white m-10 rounded-2xl p-5 h-60">
       <Navbar />
       <Heading title="Blog"/>
     </div>
    </>
  );
};
export default Page;
