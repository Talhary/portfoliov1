import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { redirect } from "next/navigation";
import { GetAllProjects } from '@/actions/getAllProjects';
import { GetBlogs } from '@/actions/getBlogs';
import { Heading } from "@/components/heading";
import DashboardTabs from './dashboard-tabs';

const Page = async () => {
  const projects = await GetAllProjects();
  const blogsResult = await GetBlogs({ page: 1, limit: 100 }); // Fetch all blogs for admin view
  
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if (!token) {
    redirect('/admin/login');
  }

  try {
    jwt.verify(token.value, process.env.JWT_TOKEN || '');
  } catch (err) {
    console.error('JWT Verification Failed:', err);
    redirect('/admin/login');
    return null; // This line ensures no further execution
  }

  return (
    <div className="space-y-6">
      <Heading title="Admin Dashboard" />
      <DashboardTabs 
        initialProjects={projects} 
        initialBlogs={blogsResult.data || []} 
      />
    </div>
  );
};

export default Page;
