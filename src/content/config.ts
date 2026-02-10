import { defineCollection, z } from 'astro:content';

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    published: z.boolean().default(false),
    description: z.string().optional(),
  }),
});

export const collections = { notes };
