'use server'
import {formSchema} from '@/lib/form-type'
import {z} from 'zod'
import {db} from '@/lib/db'
import { STATIC_PROJECTS } from '@/actions/getAllProjects'

type output = {
    data: z.infer<typeof formSchema> | null,
    status: number
}

export const getItemFromId = async(id: string): Promise<output> => {
  try {
    const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // 1. Check in STATIC_PROJECTS first for instant retrieval
    const staticMatch = STATIC_PROJECTS.find(p => p.id === id || slugify(p.title) === id);
    if (staticMatch) {
      return { status: 200, data: staticMatch };
    }

    // 2. Try matching raw CUID in Database
    let data = await db.projects.findFirst({
        where: {
            id: id
        }
    });

    // 3. If no direct CUID matches, perform a slug-to-title comparison on DB projects
    if (!data) {
      const allProjects = await db.projects.findMany();
      data = allProjects.find(p => slugify(p.title) === id) || null;
    }
  
    return { status: 200, data };
  } catch(e: any) {
    console.error('Error fetching project by slug/id:', e);
    // Fallback to static projects check on db failure
    const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const staticMatch = STATIC_PROJECTS.find(p => p.id === id || slugify(p.title) === id);
    if (staticMatch) {
      return { status: 200, data: staticMatch };
    }
    return { status: 500, data: null };
  }
}