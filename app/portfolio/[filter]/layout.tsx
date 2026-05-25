import { PortfolioNavbar } from "@/components/portfolio-navbar";
import { GetAllProjects } from "@/actions/getAllProjects";
import { getCategories } from "@/actions/categories";

const Layout = async ({ 
  children, 
  params: { filter } 
}: { 
  params: { filter: string }; 
  children: React.ReactNode; 
}) => {
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

  const isValidRoute = ['all', ...activeCategories].indexOf(filter.toLowerCase()) !== -1;

  return (
    <div className="space-y-6">
      <PortfolioNavbar filter={filter} items={navbarItems} />
      
      {!isValidRoute ? (
        <dialog open className="bg-rose-500/10 border border-rose-500/20 text-rose-550 dark:text-rose-450 text-xl font-semibold text-center py-10 rounded-2xl w-full">
          Category Empty or Page Not Found
        </dialog>
      ) : (
        <div>
          {children}
        </div>
      )}
    </div>
  );
};

export default Layout;