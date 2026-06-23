# Development container for awesome-agent-stack
# Based on Microsoft's devcontainer Node image (includes git, zsh, common tooling).
FROM mcr.microsoft.com/devcontainers/javascript-node:24

# Enable pnpm via Corepack (bundled with Node)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Astro dev server default port
EXPOSE 4321

# Work as the non-root "node" user (provided by the base image)
USER node
