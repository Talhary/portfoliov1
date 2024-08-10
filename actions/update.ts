'use server';

import { db } from "@/lib/db";

export const updateProjectById = async (id: any, updateData: any) => {
    console.log(updateData)
  try {
    const updatedProject = await db.projects.update({
      where: { id },
      data: updateData,
    });
    return { status: 200, data: updatedProject };
  } catch (error) {
    console.error("Error updating project:", error);
    throw new Error("Failed to update project");
  }
};
