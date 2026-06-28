import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHighlighter, type Highlighter } from 'shiki';
import MarkdownIt from 'markdown-it';

const SAMPLES_DIR = 'samples';
const REPO = 'https://github.com/codecompose7/awesome-agent-stack';
const THEME = 'github-dark';
const LANGS = [
  'python',
  'typescript',
  'tsx',
  'javascript',
  'jsx',
  'bash',
  'docker',
  'markdown',
  'json',
  'yaml',
  'toml',
  'sql',
  'go',
  'rust',
];

let hlPromise: Promise<Highlighter> | null = null;
function getHighlighter() {
  if (!hlPromise) hlPromise = createHighlighter({ themes: [THEME], langs: LANGS });
  return hlPromise;
}
function highlight(hl: Highlighter, code: string, lang: string): string {
  const l = hl.getLoadedLanguages().includes(lang) ? lang : 'text';
  // Tag the <pre> with its language so CSS can soft-wrap shell/output blocks
  // (bash, text…) while leaving real source code horizontally scrollable.
  return hl
    .codeToHtml(code, { lang: l, theme: THEME })
    .replace(/^<pre/, `<pre data-lang="${l}"`);
}

export interface ProjectFile {
  path: string; // relative to the project folder, e.g. "app.py"
  html: string; // Shiki-highlighted
}
export interface ProjectHeading {
  slug: string;
  text: string;
  depth: number;
}
export interface RenderedProject {
  folder: string;
  name: string;
  date: string; // when the example was written (YYYY-MM-DD)
  readmeHtml?: string;
  headings: ProjectHeading[]; // README h2/h3, for the right-rail TOC
  files: ProjectFile[];
  folderUrl: string;
}

// When each sample was authored. Per-folder overrides go here; anything not
// listed falls back to DEFAULT_SAMPLE_DATE.
const DEFAULT_SAMPLE_DATE = '2026-06-28';
const SAMPLE_DATES: Record<string, string> = {};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N} -]/gu, '')
    .replace(/\s+/g, '-');
}

/**
 * Render a project README to HTML, giving its h2/h3 stable ids (prefixed with
 * the folder so headings stay unique across projects) plus a copy-link anchor,
 * and collecting those headings for the right-rail TOC.
 */
function renderReadme(
  md: MarkdownIt,
  content: string,
  folder: string,
): { html: string; headings: ProjectHeading[] } {
  const tokens = md.parse(content, {});
  const headings: ProjectHeading[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const tk = tokens[i];
    if (tk.type === 'heading_open' && (tk.tag === 'h2' || tk.tag === 'h3')) {
      const text = tokens[i + 1]?.content ?? '';
      const slug = `${folder}-${slugify(text)}`;
      tk.attrSet('id', slug);
      headings.push({ slug, text, depth: tk.tag === 'h2' ? 2 : 3 });
    }
  }
  const html = md.renderer.render(tokens, md.options, {}).replace(
    /<(h[23]) id="([^"]+)">([\s\S]*?)<\/\1>/g,
    (_m, tag, id, inner) =>
      `<${tag} id="${id}">` +
      `<a class="aas-anchor" href="#${id}" aria-label="Copy link to section"></a>${inner}</${tag}>`,
  );
  return { html, headings };
}

function langFor(name: string): string {
  if (name === 'Dockerfile' || name.endsWith('.dockerfile')) return 'docker';
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    py: 'python',
    ts: 'typescript',
    tsx: 'tsx',
    js: 'javascript',
    jsx: 'jsx',
    md: 'markdown',
    toml: 'toml',
    yml: 'yaml',
    yaml: 'yaml',
    json: 'json',
    sh: 'bash',
    bash: 'bash',
    env: 'bash',
    sql: 'sql',
    go: 'go',
    rs: 'rust',
  };
  return map[ext] ?? 'text';
}

// In the file tree: source first, then Dockerfile, then dependency/config files.
function priority(path: string): number {
  const name = path.split('/').pop() ?? path;
  if (name === 'Dockerfile' || name.endsWith('.dockerfile')) return 1;
  if (/^requirements|^package\.json$|^pyproject|^package-lock|lock$/i.test(name)) return 3;
  return 0;
}

function walk(dir: string, base: string, out: { path: string; name: string; content: string }[]): void {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, base, out);
    else out.push({ path: relative(base, full), name, content: readFileSync(full, 'utf8') });
  }
}

/**
 * Subset of `paths` (relative to the repo root) that git would ignore, so files
 * like `.env` never leak into the rendered file tree. Respects nested .gitignore
 * files and negations. Falls back to ignoring nothing if git isn't available.
 */
function gitIgnored(paths: string[]): Set<string> {
  if (!paths.length) return new Set();
  try {
    const out = execFileSync('git', ['check-ignore', '--stdin'], {
      input: paths.join('\n'),
      encoding: 'utf8',
    });
    return new Set(out.split('\n').map((s) => s.trim()).filter(Boolean));
  } catch (err) {
    // Exit code 1 ("nothing ignored") still throws; its stdout holds any matches.
    const out = (err as { stdout?: string }).stdout ?? '';
    return new Set(out.split('\n').map((s) => s.trim()).filter(Boolean));
  }
}

/** A README file in the project, with an optional locale suffix:
 *  README.md (default) or README.<lang>.md (e.g. README.ko.md). */
const README_RE = /^readme(?:\.([a-z]{2}))?\.md$/i;

/**
 * Read + render the sample projects in the given `samples/<folder>/` list.
 * For each project the README is localized: `README.<lang>.md` is used when it
 * exists, otherwise the plain `README.md` is the fallback.
 */
export async function renderProjects(folders: string[], lang: string): Promise<RenderedProject[]> {
  const hl = await getHighlighter();
  const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const md = new MarkdownIt({
    html: false,
    linkify: true,
    highlight: (code, info) => {
      const lang = (info || '').trim() || 'text';
      // Hand mermaid blocks to the client-side MermaidLoader instead of Shiki,
      // so README diagrams render as graphics rather than highlighted text.
      if (lang === 'mermaid') return `<pre class="mermaid">${escapeHtml(code)}</pre>`;
      return highlight(hl, code, lang);
    },
  });
  // README links open in a new tab.
  const baseLink = md.renderer.rules.link_open ?? ((t, i, o, _e, s) => s.renderToken(t, i, o));
  md.renderer.rules.link_open = (tokens, idx, opts, env, self) => {
    tokens[idx].attrSet('target', '_blank');
    tokens[idx].attrSet('rel', 'noopener noreferrer');
    return baseLink(tokens, idx, opts, env, self);
  };

  const out: RenderedProject[] = [];
  for (const folder of folders) {
    const dir = join(SAMPLES_DIR, folder);
    if (!existsSync(dir)) continue;
    const raw: { path: string; name: string; content: string }[] = [];
    walk(dir, dir, raw);
    if (!raw.length) continue;

    // Hide gitignored files (e.g. a local .env) from the file tree.
    const ignored = gitIgnored(raw.map((f) => join(dir, f.path)));
    const shown = raw.filter((f) => !ignored.has(join(dir, f.path)));
    if (!shown.length) continue;

    // Pick the README for the current language: README.<lang>.md, else the
    // plain README.md. All README variants are kept out of the file tree.
    const readmes = shown.filter((f) => README_RE.test(f.path));
    const readme =
      readmes.find((f) => f.path.toLowerCase() === `readme.${lang}.md`) ??
      readmes.find((f) => f.path.toLowerCase() === 'readme.md') ??
      readmes[0];

    let readmeHtml: string | undefined;
    let headings: ProjectHeading[] = [];
    let name = folder;
    if (readme) {
      ({ html: readmeHtml, headings } = renderReadme(md, readme.content, folder));
      name = readme.content.match(/^#\s+(.+?)\s*$/m)?.[1] ?? folder;
    }

    const files: ProjectFile[] = [];
    for (const f of shown
      .filter((f) => !README_RE.test(f.path))
      .sort((a, b) => priority(a.path) - priority(b.path) || a.path.localeCompare(b.path))) {
      files.push({ path: f.path, html: highlight(hl, f.content, langFor(f.name)) });
    }
    out.push({
      folder,
      name,
      date: SAMPLE_DATES[folder] ?? DEFAULT_SAMPLE_DATE,
      readmeHtml,
      headings,
      files,
      folderUrl: `${REPO}/tree/main/samples/${folder}`,
    });
  }
  return out;
}
