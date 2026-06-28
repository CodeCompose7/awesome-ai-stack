/**
 * Resolve a content image to a usable src: an absolute URL is returned as-is,
 * a `/public` path gets the site `base` prepended (same rule as logos).
 */
export function assetSrc(p?: string): string | undefined {
  if (!p) return undefined;
  if (/^https?:\/\//.test(p)) return p;
  const base = import.meta.env.BASE_URL;
  return base.replace(/\/$/, '') + '/' + p.replace(/^\//, '');
}
