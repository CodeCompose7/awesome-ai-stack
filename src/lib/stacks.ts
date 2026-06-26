import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';
import { descendantIds } from '../data/categories';

export type StackEntry = CollectionEntry<'stacks'>;

/** The url slug of an entry, i.e. its id with the `<lang>/` prefix removed. */
export function slugOf(entry: StackEntry): string {
  return entry.id.replace(/^[a-z]{2}\//, '');
}

/** All stack entries for one locale (entries live in `stacks/<lang>/*.mdx`). */
export async function getStacks(lang: Lang): Promise<StackEntry[]> {
  const all = await getCollection('stacks');
  return all.filter((e) => e.id.startsWith(`${lang}/`));
}

/** Unique, sorted list of tags used by entries in a locale. */
export async function getAllTags(lang: Lang): Promise<string[]> {
  const stacks = await getStacks(lang);
  const set = new Set<string>();
  for (const s of stacks) for (const tag of s.data.tags) set.add(tag);
  return [...set].sort();
}

/** Entries in a locale that carry a given tag. */
export async function getStacksByTag(lang: Lang, tag: string): Promise<StackEntry[]> {
  const stacks = await getStacks(lang);
  return stacks.filter((s) => s.data.tags.includes(tag));
}

/**
 * Entries in a locale that belong to a category node or any of its
 * subcategories (subtree roll-up), sorted alphabetically by name.
 */
export async function getStacksByCategory(lang: Lang, id: string): Promise<StackEntry[]> {
  const ids = new Set(descendantIds(id));
  const stacks = await getStacks(lang);
  return stacks
    .filter((s) => ids.has(s.data.category))
    .sort((a, b) => a.data.name.localeCompare(b.data.name));
}
