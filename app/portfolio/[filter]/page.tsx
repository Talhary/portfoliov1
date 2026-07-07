import { Metadata } from 'next';
import { AllProjects } from '@/components/all-projects';
import { GetAllProjects } from "@/actions/getAllProjects";

export async function generateMetadata({
  params
}: {
  params: Promise<{ filter?: string }>
}): Promise<Metadata> {
  const { filter } = (await params) as { filter: string };
  const category = filter ? (filter === 'all' ? 'All' : filter.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')) : 'Projects';
  return {
    title: `${category} Projects | Talha Codes - Portfolio`,
    description: `Explore the portfolio of Talha Codes showcasing ${category.toLowerCase()} web development projects. Designed and built using React, Next.js, and modern tools.`,
    keywords: [
      `${category} projects`,
      "Talha Codes projects",
      "web development portfolio",
      "portfolio items",
      "React projects",
      "Next.js projects"
    ],
    openGraph: {
      title: `${category} Projects | Talha Codes - Portfolio`,
      description: `Explore the portfolio of Talha Codes showcasing ${category.toLowerCase()} web development projects.`,
      type: "website",
      url: `https://talhacodes.site/portfolio/${filter}`,
    }
  };
}

const Page = async ({ params }: { params: Promise<{ [key: string]: string | undefined }> }) => {
  const { filter } = (await params) as { filter: string };
  const res = await GetAllProjects(filter);
  // console.log(res)
  if (filter == 'all') return <div>
    <AllProjects projects={res} />
  </div>
  const data = res.filter((el: any) => el.type.split('|').indexOf(filter) != -1)

  return (
    <div>
      <AllProjects projects={data} />
    </div>
  );
}
export default Page;

