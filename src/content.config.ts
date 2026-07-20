import { defineAasCollections } from 'stack-site-builder/content';
import { categoryMap } from './data/categories';

// The content model (stacks / articles / concepts / slides) comes from the
// theme; this site only supplies its category tree for validation. Content
// lives under src/content/<collection>/.
export const collections = defineAasCollections({ categoryMap });
