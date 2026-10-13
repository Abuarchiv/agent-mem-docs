# agent-mem docs

Documentation for [agent-mem](https://github.com/Abuarchiv/agent-mem): one local memory for Claude Code, Codex,
GitHub Copilot and OpenCode.

**Read it at https://abuarchiv.github.io/agent-mem-docs/**

Built with [Astro Starlight](https://starlight.astro.build/) in TypeScript, styled like the agent-mem viewer.
Diagrams are [Excalidraw](https://excalidraw.com) scenes rendered by Excalidraw itself.

```sh
npm install
npm run dev          # http://localhost:4321/agent-mem-docs/
npm run build
npm run diagrams     # re-render diagrams/*.ts with Excalidraw (needs Playwright's Chromium)
AGENT_MEM_SRC=../agent-mem npx tsx scripts/check-coverage.ts
```

| Folder | What |
| --- | --- |
| `src/content/docs/` | the pages (MDX) |
| `diagrams/` | diagram scenes in TypeScript (`_lib.ts`: boxes, arrows, sequence diagrams) |
| `public/diagrams/` | rendered `.svg` and editable `.excalidraw` files |
| `src/styles/`, `src/components/` | the agent-mem look: palette, fonts, sidebar, brand |
| `scripts/` | diagram renderer, coverage check |

The coverage check fails when the docs miss a table, a config key, a CLI command or option, an environment
variable, an MCP tool or a hook event that the agent-mem code has. CI runs it on every push and daily.

Fonts: Bricolage Grotesque, Figtree and JetBrains Mono under the SIL Open Font License (`public/fonts/*-OFL.txt`).
