import { PortfolioNavbar } from "@/components/portfolio-navbar";
import { GetAllProjects } from "@/actions/getAllProjects";
import { getCategories } from "@/actions/categories";
import { Suspense } from "react";

const Layout = async ({ 
  children, 
  params 
}: { 
  params: Promise<{ [key: string]: string | undefined }>; 
  children: React.ReactNode; 
}) => {
  const { filter } = (await params) as { filter: string };

  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="h-14 w-full bg-zinc-200 dark:bg-zinc-800/20 animate-pulse rounded-2xl mb-6" />}>
        <NavbarLoader filter={filter} />
      </Suspense>
      
      <div>
        {children}
      </div>
    </div>
  );
};

const NavbarLoader = async ({ filter }: { filter: string }) => {
  // Fetch all projects to see which categories actually have items
  const projects = await GetAllProjects('all');
  
  // Extract unique active categories from existing projects
  const activeCategories = Array.from(
    new Set(
      projects.flatMap((project: any) => 
        project.type
          .split('|')
          .map((t: string) => t.trim().toLowerCase())
          .filter(Boolean)
      )
    )
  );

  // Fetch registered categories from database to map display names
  const dbCategoriesRes = await getCategories();
  const dbCategories = dbCategoriesRes.success ? dbCategoriesRes.data : [];

  // Define fallback formatting for static/dynamic display labels
  const getCategoryLabel = (value: string) => {
    if (value === 'websites') return 'Websites';
    if (value === 'webapps') return 'Web Apps';
    if (value === 'frontend') return 'Front End';
    if (value === 'backend') return 'Backend';

    // Find display name in dynamic database list
    const dbMatch = dbCategories.find((cat: any) => cat.value === value);
    if (dbMatch) return dbMatch.name;

    // Fallback camel/kebab formatting
    return value
      .split('-')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  // Build items for PortfolioNavbar (Always prepend 'All')
  const navbarItems = [
    { label: 'All', value: 'all' },
    ...activeCategories.map((value: string) => ({
      label: getCategoryLabel(value),
      value
    }))
  ];

  return <PortfolioNavbar filter={filter} items={navbarItems} />;
};

export default Layout;
