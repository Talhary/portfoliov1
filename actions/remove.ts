'use server'
import { db } from "@/lib/db";

export const removeProjectById = async (id:any) => {
  try {
    const res = await db.projects.delete({
      where: { id },
    });
    return {status:200,data:res}
  } catch (error) {
    console.error("Error removing project:", error);
    throw new Error("Failed to remove project");
  }
};
