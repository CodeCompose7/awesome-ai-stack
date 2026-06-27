import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';
import { descendantIds } from '../data/categories';

export type StackEntry = CollectionEntry<'stacks'>;

/** The url slug of an entry, i.e. its id with the `<lang>/` prefix removed. */
export function slugOf(entry: StackEntry): string {
  return entry.id.replace(/^[a-z]{2}\//, '');
}

/** A name → url-safe slug, e.g. "Roo Code" → "roo-code". */
export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Redirect aliases for a locale's stacks: each former name (after a rename)
 * slugifies to an alias that should redirect to the entry's canonical slug.
 * Aliases that collide with a real slug or each other are dropped.
 */
export async function getStackAliases(lang: Lang): Promise<{ alias: string; target: string }[]> {
  const stacks = await getStacks(lang);
  const canonical = new Set(stacks.map(slugOf));
  const seen = new Set<string>();
  const out: { alias: string; target: string }[] = [];
  for (const s of stacks) {
    const target = slugOf(s);
    for (const former of s.data.formerNames) {
      const alias = slugifyName(former);
      if (!alias || alias === target || canonical.has(alias) || seen.has(alias)) continue;
      seen.add(alias);
      out.push({ alias, target });
    }
  }
  return out;
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

/** Unique vendor url-slugs across a locale's stacks (for /vendors/<slug>). */
export async function getAllVendors(lang: Lang): Promise<string[]> {
  const stacks = await getStacks(lang);
  const set = new Set<string>();
  for (const s of stacks) if (s.data.vendor) set.add(slugifyName(s.data.vendor));
  return [...set].sort();
}

/** Entries in a locale whose vendor slugifies to `slug`, sorted by name. */
export async function getStacksByVendor(lang: Lang, slug: string): Promise<StackEntry[]> {
  const stacks = await getStacks(lang);
  return stacks
    .filter((s) => s.data.vendor && slugifyName(s.data.vendor) === slug)
    .sort((a, b) => a.data.name.localeCompare(b.data.name));
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
