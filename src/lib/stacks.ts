import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

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
