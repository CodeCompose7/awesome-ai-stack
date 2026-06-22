import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The `stacks` collection holds one entry per tool/service used to build
 * AI agents. Each entry is an MDX file: frontmatter powers the listing and
 * cards, while the body is the per-service detail page (overview + sample code).
 */
const stacks = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/stacks' }),
  schema: z.object({
    name: z.string(),
    category: z.string(),
    description: z.string(),
    website: z.string().url().optional(),
    repo: z.string().url().optional(),
    docs: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    language: z.string().optional(),
    license: z.string().optional(),
    pricing: z.enum(['open-source', 'free-tier', 'paid', 'freemium']).optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { stacks };
