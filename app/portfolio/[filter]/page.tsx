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
    alternates: {
      canonical: `/portfolio/${filter}`,
    },
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

  if (data.length === 0) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-xl font-semibold text-center py-10 rounded-2xl w-full">
        Category Empty or Page Not Found
      </div>
    );
  }

  return (
    <div>
      <AllProjects projects={data} />
    </div>
  );
}
export default Page;

