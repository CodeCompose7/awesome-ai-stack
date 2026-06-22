import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The `stacks` collection holds one entry per tool/service used to build
 * AI agents. Each entry is an MDX file: frontmatter powers the listing and
 * cards, while the body is the per-service detail page (overview + sample code).
 *
 * Entries are locale-partitioned: `stacks/en/<slug>.mdx`, `stacks/ko/<slug>.mdx`.
 */
const stacks = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/stacks' }),
  schema: z.object({
    name: z.string(),
    category: z.string(),
    description: z.string(),
    logo: z.string().optional(), // optional image URL/path; otherwise a monogram is shown
    website: z.string().url().optional(),
    repo: z.string().url().optional(),
    docs: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    language: z.string().optional(),
    license: z.string().optional(),
    // Composable pricing/hosting model tags (a tool can be several at once):
    //   open-source = source is open / free to self-host
    //   free-tier   = vendor-hosted free tier
    //   paid        = paid plans exist
    //   free        = entirely free to use (non-OSS)
    pricing: z.array(z.enum(['open-source', 'free-tier', 'paid', 'free'])).default([]),
    featured: z.boolean().default(false),
  }),
});

/**
 * The `articles` collection is the writing space — long-form posts kept
 * separate from the tool catalog. `tools` lists the stack slugs an article
 * references; it powers both forward links (article → tool) and backlinks
 * (tool → article, computed in src/lib/articles.ts).
 *
 * Locale-partitioned like stacks: `articles/en/<slug>.mdx`, `articles/ko/...`.
 */
const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tools: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { stacks, articles };
