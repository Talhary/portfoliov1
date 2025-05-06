
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';
const Page = async () => {
    redirect('/portfolio/all')
    return <div >
        <Loader2 className='animate-spin h-5 w-5 dark:text-white'/>
    </div>
};
export default Page;
