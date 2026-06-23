import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { codeToHtml } from 'shiki';
import MarkdownIt from 'markdown-it';

const SAMPLES_DIR = 'samples';
const REPO = 'https://github.com/codecompose7/awesome-agent-stack';
const md = new MarkdownIt({ html: false, linkify: true });

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

async function highlight(content: string, name: string): Promise<string> {
  const lang = langFor(name);
  try {
    return await codeToHtml(content, { lang, theme: 'github-dark' });
  } catch {
    return await codeToHtml(content, { lang: 'text', theme: 'github-dark' });
  }
}

/** Read + render the sample projects in the given `samples/<folder>/` list. */
export async function renderProjects(folders: string[]): Promise<RenderedProject[]> {
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
        files.push({ path: f.path, html: await highlight(f.content, f.name) });
      }
    }
    out.push({ folder, name, readmeHtml, files, folderUrl: `${REPO}/tree/main/samples/${folder}` });
  }
  return out;
}
