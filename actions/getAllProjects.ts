import { db } from "@/lib/db";

const STATIC_PROJECTS: any[] = [
  {
    id: "static-instagram-reels-downloader",
    title: "Instagram Reels Downloader",
    description: "A high-performance, clean, and secure web application to download Instagram Reels and videos directly in HD. Designed with a custom orange/amber modern UI, full Google AdSense compliance, and a backend-powered secure proxy that hides source downloads to protect user privacy.",
    type: "tools",
    link: "/tools/instagram-reels-downloader",
    imageUrl: ["https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000&auto=format&fit=crop"],
    githubUrl: "https://github.com/talhary/portfoliov1",
    order: 1,
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript", "API Routes"],
    createdAt: new Date("2026-07-14T00:00:00Z"),
    updatedAt: new Date("2026-07-14T00:00:00Z"),
  }
];

export const GetAllProjects = async(filter?:string)=>{
    try {
        const res = await db.projects.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        const combined = [...res, ...STATIC_PROJECTS];
        
        // Prioritize projects with custom order (> 0) ascending,
        // and keep unassigned projects (order = 0) at the end sorted by date descending.
        const sorted = combined.sort((a, b) => {
            const orderA = a.order ?? 0;
            const orderB = b.order ?? 0;

            if (orderA > 0 && orderB > 0) {
                if (orderA !== orderB) return orderA - orderB;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            if (orderA > 0) return -1;
            if (orderB > 0) return 1;

            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return sorted;
    } catch (error) {
        console.error("Error retrieving projects:", error);
        return STATIC_PROJECTS;
    }
}