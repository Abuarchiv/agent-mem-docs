// Writes the site as plain GitHub Markdown (the agent-mem-docs-md repository): README.md from the start page with
// the contents, docs/<page>.md for every other page, assets/ with the diagrams and screenshots.
// Usage: npx tsx scripts/export-markdown.ts ../agent-mem-md
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const out = process.argv[2];
if (!out) {
  console.error("usage: npx tsx scripts/export-markdown.ts <output folder>");
  process.exit(2);
}
const SITE = "https://abuarchiv.github.io/agent-mem-docs/";
const ALERT: Record<string, string> = { note: "NOTE", tip: "TIP", caution: "WARNING", danger: "CAUTION" };

// The sidebar of astro.config.ts gives the order and the group names.
type Item = { slug: string; label?: string };
const settings = readFileSync(join(root, "astro.config.ts"), "utf-8");
const sidebar = [...settings.matchAll(/label: "(.*?)",\s*items: \[([\s\S]*?)\]/g)].map((m) => ({
  label: m[1],
  items: [...m[2].matchAll(/\{ label: "(.*?)", slug: "(.*?)" \}|"([\w/-]+)"/g)].map(
    (i): Item => (i[2] ? { label: i[1], slug: i[2] } : { slug: i[3] }),
  ),
}));
const slugs = sidebar.flatMap((g) => g.items.map((i) => i.slug));

const source = (slug: string) => readFileSync(join(root, "src/content/docs", `${slug}.mdx`), "utf-8");
const file = (slug: string) => (slug === "index" ? "README.md" : `docs/${slug}.md`);
const frontmatter = (text: string) => {
  const head = text.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? "";
  const field = (key: string) => head.match(new RegExp(`^${key}: (.*)$`, "m"))?.[1].replace(/^"(.*)"$/, "$1") ?? "";
  return { title: field("title"), description: field("description"), body: text.slice(text.indexOf("\n---\n", 3) + 5) };
};
const pages = new Map(slugs.map((slug) => [slug, frontmatter(source(slug))]));
// The start page is linked by its title, as on the site's own previous/next links.
const label = (slug: string) =>
  (slug !== "index" && sidebar.flatMap((g) => g.items).find((i) => i.slug === slug)?.label) || pages.get(slug)!.title;

// A site path (/architecture/hooks/#x, /agent-mem-docs/screens/y.png) as a path relative to the page's file.
function link(from: string, target: string): string {
  const path = target.replace(/^\/agent-mem-docs/, "");
  const [page, hash] = path.split("#");
  const asset = page.match(/^\/(diagrams|screens)\/(.+)$/);
  const to = asset ? `assets/${asset[1]}/${asset[2]}` : file(page.replace(/^\/|\/$/g, "") || "index");
  const rel = relative(dirname(file(from)), to);
  return rel + (hash ? `#${hash}` : "");
}

function convert(slug: string, body: string): string {
  let text = body.replace(/^import .*\n/gm, "");
  text = text.replace(/<p class="am-lede">([\s\S]*?)<\/p>/, (_, inner: string) => inner.replace(/<code>(.*?)<\/code>/g, "`$1`"));
  text = text.replace(/^\s*<\/?(Steps|Tabs|CardGrid)>\s*\n/gm, "");
  text = text.replace(/^<TabItem label="(.*?)">$/gm, "**$1**").replace(/^<\/TabItem>\n/gm, "");
  text = text.replace(/<Aside type="(\w+)">\n([\s\S]*?)\n<\/Aside>/g, (_, type: string, inner: string) =>
    [`> [!${ALERT[type]}]`, ...inner.split("\n").map((line) => (line ? `> ${line}` : ">"))].join("\n"));
  text = text.replace(/^\s*<Card title="(.*?)"[^>]*>\n([\s\S]*?)\n\s*<\/Card>$/gm, (_, title: string, inner: string) =>
    `- **${title}:** ${inner.trim().split(/\s*\n\s*/).join(" ")}`);
  text = text.replace(/^\s*<LinkCard title="(.*?)" href="(.*?)" description="(.*?)" \/>$/gm, (_, title, href, description) =>
    `- [${title}](${link(slug, href)}): ${description}`);
  text = text.replace(/<Diagram name="(.*?)" alt="(.*?)"(?: caption="(.*?)")? \/>/g, (_, name: string, alt: string, caption?: string) => {
    const scene = `[Excalidraw scene](${link(slug, `/diagrams/${name}.excalidraw`)})`;
    return `![${alt}](${link(slug, `/diagrams/${name}.svg`)})\n\n<sub>${caption ? `${caption} · ` : ""}${scene}</sub>`;
  });
  // Links and images outside code: site paths become relative file paths.
  text = text
    .split(/(```[\s\S]*?```)/)
    .map((part, i) => (i % 2 ? part : part.replace(/\]\((\/[^)\s]*)\)/g, (_, target: string) => `](${link(slug, target)})`)))
    .join("");
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

function footer(slug: string): string {
  const at = slugs.indexOf(slug);
  const parts = [];
  if (at > 0) parts.push(`← [${label(slugs[at - 1])}](${link(slug, `/${slugs[at - 1]}/`)})`);
  parts.push(`[Contents](${link(slug, "/")}#contents)`);
  if (at < slugs.length - 1) parts.push(`[${label(slugs[at + 1])}](${link(slug, `/${slugs[at + 1]}/`)}) →`);
  return parts.join(" · ");
}

function contents(): string {
  const lines = ["## Contents", ""];
  for (const group of sidebar) {
    const items = group.items.map((i) => i.slug).filter((s) => s !== "index");
    if (!items.length) continue;
    lines.push(`**${group.label}**`, "");
    for (const slug of items) lines.push(`- [${label(slug)}](${file(slug)}): ${pages.get(slug)!.description}`);
    lines.push("");
  }
  return lines.join("\n").trim();
}

for (const slug of slugs) {
  const { title, description, body } = pages.get(slug)!;
  const head =
    slug === "index"
      ? `# ${title}\n\n${description}\n\nThe same pages as a website: [${SITE.replace(/^https:\/\/|\/$/g, "")}](${SITE}).`
      : `# ${title}\n\n${description}`;
  const tail = slug === "index" ? contents() : `---\n\n${footer(slug)}`;
  const target = join(out, file(slug));
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${head}\n\n${convert(slug, body)}\n\n${tail}\n`);
}
for (const kind of ["diagrams", "screens"]) cpSync(join(root, "public", kind), join(out, "assets", kind), { recursive: true });
console.log(`wrote ${slugs.length} pages to ${out}`);
