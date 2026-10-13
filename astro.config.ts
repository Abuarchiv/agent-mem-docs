import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { visit } from "unist-util-visit";

const base = "/agent-mem-docs";

// Root-relative links and images in pages ("/architecture/hooks/") get the GitHub Pages base path.
function remarkBaseLinks() {
  return (tree: Parameters<typeof visit>[0]) => {
    visit(tree, ["link", "definition", "image"], (node: { url?: string }) => {
      if (node.url?.startsWith("/") && !node.url.startsWith("//") && !node.url.startsWith(base)) {
        node.url = base + node.url;
      }
    });
  };
}

export default defineConfig({
  site: "https://abuarchiv.github.io",
  base,
  trailingSlash: "always",
  markdown: { remarkPlugins: [remarkBaseLinks] },
  integrations: [
    starlight({
      title: "agent-mem",
      description: "One local memory for Claude Code, Codex, GitHub Copilot and OpenCode.",
      favicon: "/favicon.svg",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/Abuarchiv/agent-mem" }],
      customCss: ["./src/styles/fonts.css", "./src/styles/agent-mem.css"],
      components: {
        SiteTitle: "./src/components/SiteTitle.astro",
        Sidebar: "./src/components/Sidebar.astro",
      },
      expressiveCode: {
        themes: ["github-light", "github-dark"],
        styleOverrides: {
          borderRadius: "14px",
          borderColor: "var(--am-line)",
          codeFontFamily: "var(--am-mono)",
          uiFontFamily: "var(--am-sans)",
          codeFontSize: "0.82rem",
          frames: { shadowColor: "transparent", editorActiveTabIndicatorTopColor: "var(--am-pink-deep)" },
        },
      },
      sidebar: [
        {
          label: "Get started",
          items: [
            { label: "Introduction", slug: "index" },
            "getting-started/installation",
            "getting-started/first-session",
            "getting-started/upgrade-uninstall",
          ],
        },
        {
          label: "Agents",
          items: [
            "agents/claude-code",
            "agents/codex",
            "agents/copilot",
            "agents/opencode",
          ],
        },
        {
          label: "Using agent-mem",
          items: [
            "using/briefing",
            "using/recall-during-work",
            "using/search-and-mcp",
            "using/viewer",
            "using/rules-and-lessons",
            "using/privacy",
            "using/pause-export-purge",
          ],
        },
        {
          label: "Background facts",
          items: [
            "facts/how-facts-are-written",
            "facts/providers-and-models",
          ],
        },
        {
          label: "Configuration",
          items: [
            "configuration/config-json",
            "configuration/project-settings",
            "configuration/cli",
            "configuration/environment",
          ],
        },
        {
          label: "Architecture",
          items: [
            "architecture/overview",
            "architecture/hooks",
            "architecture/hook-lifecycle",
            "architecture/background-processes",
            "architecture/observer-pipeline",
            "architecture/database",
            "architecture/search",
            "architecture/context-injection",
            "architecture/learning-and-ranking",
            "architecture/capture-and-privacy",
            "architecture/token-accounting",
          ],
        },
        {
          label: "Reference",
          items: [
            "troubleshooting",
            "measurements",
            "development",
          ],
        },
      ],
    }),
  ],
});
