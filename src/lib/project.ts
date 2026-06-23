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
  return hl.codeToHtml(code, { lang: l, theme: THEME });
}

export interface ProjectFile {
  path: string; // relative to the project folder, e.g. "app.py"
  html: string; // Shiki-highlighted
}
export interface RenderedProject {
  folder: string;
  name: string;
  readmeHtml?: string;
  files: ProjectFile[];
  folderUrl: string;
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

/** Read + render the sample projects in the given `samples/<folder>/` list. */
export async function renderProjects(folders: string[]): Promise<RenderedProject[]> {
  const hl = await getHighlighter();
  const md = new MarkdownIt({
    html: false,
    linkify: true,
    highlight: (code, info) => highlight(hl, code, (info || '').trim() || 'text'),
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

    let readmeHtml: string | undefined;
    let name = folder;
    const files: ProjectFile[] = [];
    for (const f of raw.sort((a, b) => priority(a.path) - priority(b.path) || a.path.localeCompare(b.path))) {
      if (/^readme\.md$/i.test(f.path)) {
        readmeHtml = md.render(f.content);
        name = f.content.match(/^#\s+(.+?)\s*$/m)?.[1] ?? folder;
      } else {
        files.push({ path: f.path, html: highlight(hl, f.content, langFor(f.name)) });
      }
    }
    out.push({ folder, name, readmeHtml, files, folderUrl: `${REPO}/tree/main/samples/${folder}` });
  }
  return out;
}
