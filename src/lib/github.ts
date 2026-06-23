/**
 * Build-time GitHub stats. Given a repo URL, fetch star count and the latest
 * release/tag from the GitHub API so cards/detail reflect the project's real
 * state as of the last build — no manual entry.
 *
 * Results are memoized per repo for the process, so the same repo is fetched
 * once even though it appears across locales and on both card + detail. Any
 * failure (offline, rate limit, no repo) degrades gracefully to `null`.
 *
 * In CI, set GITHUB_TOKEN to lift the unauthenticated 60 req/hour limit.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

export interface RepoStats {
  stars: number;
  version?: string;
  releasedAt?: string; // ISO date of the latest release (YYYY-MM-DD usable via slice)
}

const cache = new Map<string, Promise<RepoStats | null>>();

// On-disk fallback so values survive rate-limited builds (e.g. local dev without
// a token). A successful fetch updates it; a failure falls back to it.
const CACHE_DIR = '.aas-cache';
const CACHE_FILE = `${CACHE_DIR}/github.json`;
let disk: Record<string, RepoStats> = {};
try {
  disk = JSON.parse(readFileSync(CACHE_FILE, 'utf8'));
} catch {
  /* no cache yet */
}
function persist() {
  try {
    if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(CACHE_FILE, JSON.stringify(disk));
  } catch {
    /* read-only fs — skip */
  }
}

function parseRepo(url?: string): { owner: string; repo: string } | null {
  if (!url) return null;
  const m = url.match(/github\.com\/([^/]+)\/([^/#?]+)/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/, '') };
}

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'awesome-agent-stack-build',
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

/** Normalize a tag like "0.2.1" or "v0.2.1" to a displayed "v0.2.1". */
function normalizeVersion(tag?: string): string | undefined {
  if (!tag) return undefined;
  const t = tag.trim();
  return /^v\d/i.test(t) ? t : /^\d/.test(t) ? `v${t}` : t;
}

async function fetchStats(owner: string, repo: string): Promise<RepoStats | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: headers() });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    const stars = typeof data.stargazers_count === 'number' ? data.stargazers_count : 0;

    let version: string | undefined;
    let releasedAt: string | undefined;
    const rel = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, {
      headers: headers(),
    });
    if (rel.ok) {
      const data = await rel.json();
      version = normalizeVersion(data.tag_name);
      releasedAt = data.published_at; // e.g. "2026-05-12T09:00:00Z"
    } else {
      // No releases — fall back to the most recent tag (no date available).
      const tags = await fetch(`https://api.github.com/repos/${owner}/${repo}/tags?per_page=1`, {
        headers: headers(),
      });
      if (tags.ok) version = normalizeVersion((await tags.json())[0]?.name);
    }
    return { stars, version, releasedAt };
  } catch {
    return null;
  }
}

export function getRepoStats(repoUrl?: string): Promise<RepoStats | null> {
  const slug = parseRepo(repoUrl);
  if (!slug) return Promise.resolve(null);
  const key = `${slug.owner}/${slug.repo}`;
  if (!cache.has(key)) {
    cache.set(
      key,
      fetchStats(slug.owner, slug.repo).then((stats) => {
        if (stats) {
          disk[key] = stats;
          persist();
          return stats;
        }
        return disk[key] ?? null; // rate-limited/offline → last known value
      }),
    );
  }
  return cache.get(key)!;
}

/** Compact star count: 1234 → "1.2k", 23456 → "23k". */
export function formatStars(n: number): string {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return (k >= 10 ? Math.round(k) : Math.round(k * 10) / 10) + 'k';
}
