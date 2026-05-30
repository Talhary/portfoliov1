import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { redirect } from "next/navigation";
import { getItemFromId } from '@/actions/getItemFromId';
import { Heading } from "@/components/heading";
import EditProjectForm from "./_components/edit-form";

const Page = async ({
  params
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params;
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

  const project = await getItemFromId(id);
  if (!project.data) {
    return <div className="text-white p-8">Project not found or something went wrong.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Heading title="Edit Project" />
      <EditProjectForm project={project.data} />
    </div>
  );
};

export default Page;
