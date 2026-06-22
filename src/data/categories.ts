/**
 * Canonical category list. The `id` must match the `category` field used in
 * the frontmatter of entries under `src/content/stacks`. Order here is the
 * order sections render on the homepage.
 */
export interface Category {
  id: string;
  label: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 'frameworks',
    label: 'Agent Frameworks',
    description: 'Libraries for orchestrating reasoning loops, tools, and multi-agent flows.',
  },
  {
    id: 'coding-agents',
    label: 'Coding Agents',
    description: 'Autonomous agents that read, write, and run code to complete software tasks.',
  },
  {
    id: 'llm-providers',
    label: 'LLM Providers & Gateways',
    description: 'Foundation-model APIs — and the gateways that unify them — powering an agent’s reasoning.',
  },
  {
    id: 'vector-stores',
    label: 'Vector Stores & Memory',
    description: 'Embeddings storage and retrieval for long-term memory and RAG.',
  },
  {
    id: 'observability',
    label: 'Observability & Eval',
    description: 'Tracing, evaluation, and monitoring for agent runs.',
  },
];

export const categoryMap = new Map(categories.map((c) => [c.id, c]));
