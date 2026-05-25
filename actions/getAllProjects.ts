import { db } from "@/lib/db";

export const GetAllProjects = async(filter?:string)=>{
    const res = await db.projects.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
    
    // Prioritize projects with custom order (> 0) ascending,
    // and keep unassigned projects (order = 0) at the end sorted by date descending.
    const sorted = [...res].sort((a, b) => {
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
}