// Renders every diagram in diagrams/*.ts with Excalidraw in headless Chromium.
// Writes public/diagrams/<name>.excalidraw (open it on excalidraw.com to edit)
// and <name>.svg for the site (shown on a paper card in light and dark mode).
import { build } from "esbuild";
import { chromium } from "playwright";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";
import { pathToFileURL } from "node:url";

const root = new URL("..", import.meta.url).pathname;
const assets = join(root, "node_modules/@excalidraw/excalidraw/dist/prod");
const out = join(root, "public/diagrams");
const only = process.argv.slice(2);

const bundle = await build({
  entryPoints: [join(root, "scripts/excalidraw-entry.ts")],
  bundle: true,
  write: false,
  format: "iife",
  minify: true,
  define: { "process.env.NODE_ENV": '"production"', "import.meta.env": "{}" },
  loader: { ".woff2": "empty", ".css": "empty" },
  logLevel: "error",
});

const files = (await readdir(join(root, "diagrams"))).filter((f) => f.endsWith(".ts") && !f.startsWith("_")).sort();
await mkdir(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.route("http://assets.local/**", async (route) => {
  const path = decodeURIComponent(new URL(route.request().url()).pathname);
  const type = extname(path) === ".woff2" ? "font/woff2" : "application/octet-stream";
  await route.fulfill({ body: await readFile(join(assets, path)), contentType: type });
});
await page.setContent("<!doctype html><html><body></body></html>");
await page.evaluate(() => (window.EXCALIDRAW_ASSET_PATH = "http://assets.local/"));
await page.addScriptTag({ content: bundle.outputFiles[0].text });

let count = 0;
for (const file of files) {
  const name = file.replace(/\.ts$/, "");
  if (only.length && !only.includes(name)) continue;
  const { default: skeleton } = await import(pathToFileURL(join(root, "diagrams", file)).href);
  const result = await page.evaluate((s) => window.render(s), skeleton);
  const scene = { type: "excalidraw", version: 2, source: "https://excalidraw.com", elements: result.elements, appState: { viewBackgroundColor: "#F8F4EA" }, files: {} };
  await writeFile(join(out, `${name}.excalidraw`), JSON.stringify(scene, null, 2));
  await writeFile(join(out, `${name}.svg`), result.svg);
  count++;
}
await browser.close();
console.log(`rendered ${count} diagram(s) into public/diagrams`);
