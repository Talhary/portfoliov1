import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { redirect } from "next/navigation";
import { ProfileForm } from './upload-data';
import Projects from './projects';
import { GetAllProjects } from '@/actions/getAllProjects';
import { Heading } from "@/components/heading";


const Page = async()=>{
const res = await GetAllProjects()
const token = cookies().get('token')
if(!token){
    redirect('/admin/login')
}
try {
  
    const decoded = jwt.verify(token?.value , 'This is sdjfklsdjfklj3jskldjkjk');

    
  } catch(err) {
    console.log(err)
    console.log(err)
    redirect('/admin/login')

  }

  try {
    jwt.verify(token.value, 'ksdfjksjj3i4jw3iorjsijki');
  } catch (err) {
    console.error('JWT Verification Failed:', err);
    redirect('/admin/login');
    return null; // This line ensures no further execution
  }

  return (
    <div>
      <Heading title="Admin Dashboard" />
      <ProfileForm />
      <Projects initialItems={res} />
    </div>
  );
};

export default Page;
