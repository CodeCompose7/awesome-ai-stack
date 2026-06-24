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
    version: z.string().optional(), // manual fallback; GitHub release/tag is used when available

    // Composable pricing/hosting model tags (a tool can be several at once):
    //   open-source = source is open / free to self-host
    //   free-tier   = vendor-hosted free tier
    //   paid        = paid plans exist
    //   free        = entirely free to use (non-OSS)
    pricing: z.array(z.enum(['open-source', 'free-tier', 'paid', 'free'])).default([]),
    deprecated: z.boolean().default(false), // maintenance-only / superseded
    related: z.array(z.string()).default([]), // slugs of related tools (same collection)
    // Sample project folders under samples/. Either a bare folder name, or an
    // object pairing the folder with the tools that project uses (slugs of other
    // stacks; unknown slugs render as "not in our catalog").
    //   projects: [langgraph_1]
    //   projects:
    //     - folder: langgraph_1
    //       related: [langgraph, langchain]
    projects: z
      .array(
        z.union([
          z.string(),
          z.object({
            folder: z.string(),
            related: z.array(z.string()).default([]),
          }),
        ]),
      )
      .default([]),



    // Versioned code samples for the "Code" tab. Each can carry a Mermaid
    // diagram explaining the structure plus a highlighted code snippet.
    samples: z
      .array(
        z.object({
          version: z.string(), // label shown in the version selector
          lang: z.string().default('ts'), // language id for syntax highlighting
          description: z.string().optional(), // Markdown explanation, shown above the code
          diagram: z.string().optional(), // Mermaid source
          code: z.string(),
          note: z.string().optional(), // short caption below the code
        }),
      )
      .default([]),
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
