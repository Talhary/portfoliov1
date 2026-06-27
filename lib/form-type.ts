import { z } from 'zod';

export const formSchema = z.object({
  id:z.optional(z.string()),
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
  type: z.string().min(1, {
    message: "Type is required.",
  }),
  link: z.string().url({
    message: "Invalid URL format.",
  }),
  createdAt: z.date().or(z.string().transform((str) => new Date(str))).default(() => new Date()),
  updatedAt: z.date().or(z.string().transform((str) => new Date(str))).default(() => new Date()),
  imageUrl: z.array(z.string()).min(1, { message: 'At least one image is required.' }),
  githubUrl: z.string().url({
    message: "Invalid URL format.",
  }),
  order: z.coerce.number().int().default(0),
});
export const contactformSchema = z.object({
  name: z.string().min(1, {
      message: "Name is required.",
  }),
  email: z.string().email({
      message: "Please enter a valid email address.",
  }),
  message: z.string().min(5, {
      message: "Message must be at least 5 characters.",
  }),
});

export const blogFormSchema = z.object({
  id: z.optional(z.string()),
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
  content: z.string().min(1, {
    message: "Content is required.",
  }),
  imageUrl: z.string().optional().nullable(),
  tags: z.array(z.string()).min(1, {
    message: "At least one tag is required.",
  }),
});

