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
    title: `${category} Projects | talhatechs Portfolio - Founded by Talha`,
    description: `Explore projects and web applications engineered by talhatechs (Founded by Muhammad Talha). Built using modern stacks, Next.js, and native tools.`,
    alternates: {
      canonical: `/portfolio/${filter}`,
    },
    keywords: [
      `${category} projects`,
      "talhatechs projects",
      "Muhammad Talha projects",
      "web development portfolio",
      "portfolio items",
      "React projects",
      "Next.js projects"
    ],
    openGraph: {
      title: `${category} Projects | talhatechs Portfolio`,
      description: `Explore projects and applications engineered by talhatechs.`,
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

