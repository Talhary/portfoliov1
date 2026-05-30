import { Metadata } from 'next';
import { getItemFromId } from '@/actions/getItemFromId';
import Card from '@/app/portfolio/project/[id]/_components/card';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getItemFromId(id);
  
  if (!project.data) {
    return {
      title: "Project Not Found | Talha Riaz",
      description: "The requested project could not be found."
    };
  }

  const stripMarkdown = (md: string) => {
    if (!md) return "";
    return md
      .replace(/```[\s\S]*?```/g, '') 
      .replace(/`([^`]+)`/g, '$1') 
      .replace(/^#+\s+(.*?)$/gm, '$1') 
      .replace(/\*\*([^*]+)\*\*/g, '$1') 
      .replace(/\*([^*]+)\*/g, '$1') 
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') 
      .replace(/^\s*[-*+]\s+/gm, '') 
      .replace(/^\s*\d+\.\s+/gm, '') 
      .replace(/\n+/g, ' ') 
      .trim()
      .substring(0, 160); 
  };
  
  const title = `${project.data.title} | Talha Riaz Project`;
  const description = stripMarkdown(project.data.description) || `View details of ${project.data.title}, a project built by Talha Riaz.`;
  
  return {
    title,
    description,
    keywords: [
      project.data.title,
      "Talha Riaz project",
      "portfolio project",
      "web design",
      ...project.data.type.split('|').map((t: string) => t.trim())
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://talhatech.vercel.app/portfolio/project/${id}`,
    }
  };
}

const Page = async ({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) => {
    const { id } = await params;
    const project = await getItemFromId(id);
    if (!project.data) return <div className='dark:text-white'>Something goes wrong please reload the page</div>;
    return (
      <>
        <Card {...project.data} />
      </>
    );
}

export default Page;

