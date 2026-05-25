'use server'

import { db } from '@/lib/db'

export const getCategories = async () => {
  try {
    const categories = await (db as any).category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    return { success: true, data: categories };
  } catch (e: any) {
    console.error('Error fetching categories:', e);
    return { success: false, data: [] };
  }
};

export const addCategory = async (name: string, value: string) => {
  try {
    if (!name || !value) {
      return { success: false, message: 'Name and value are required' };
    }
    
    // Convert value to lowercase URL-friendly string
    const sanitizedValue = value.trim().toLowerCase().replace(/\s+/g, '-');
    const sanitizedName = name.trim();

    // Check if category name or value already exists to prevent raw database unique constraint exceptions
    const existing = await (db as any).category.findFirst({
      where: {
        OR: [
          { name: sanitizedName },
          { value: sanitizedValue }
        ]
      }
    });

    if (existing) {
      return { success: true, data: existing, message: 'Category already exists.' };
    }

    const category = await (db as any).category.create({
      data: {
        name: sanitizedName,
        value: sanitizedValue,
      }
    });
    return { success: true, data: category };
  } catch (e: any) {
    console.error('Error adding category:', e);
    return { success: false, message: 'Category name or value already exists.' };
  }
};
