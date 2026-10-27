// Fails when the docs miss something an agent-mem checkout has: a table, a config key, a CLI command or option,
// an environment variable, an MCP tool, or a hook event of any agent.
// Usage: AGENT_MEM_SRC=../agent-mem npx tsx scripts/check-coverage.ts
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const src = process.env.AGENT_MEM_SRC ?? join(root, "..", "agent-mem");
if (!existsSync(join(src, "src/agent_mem"))) {
  console.error(`agent-mem checkout not found at ${src}; set AGENT_MEM_SRC`);
  process.exit(2);
}
const code = (path: string) => readFileSync(join(src, path), "utf-8");
const doc = (page: string) => readFileSync(join(root, "src/content/docs", `${page}.mdx`), "utf-8");

const missing: string[] = [];
function expect(page: string, items: Iterable<string>, what: string) {
  const text = doc(page);
  for (const item of new Set(items)) if (!text.includes(item)) missing.push(`${page}: ${what} ${item}`);
}

// Tables (and the FTS5 table) from every migration.
const schemaDir = join(src, "src/agent_mem/core/schema");
const tables = readdirSync(schemaDir)
  .filter((f) => f.endsWith(".sql"))
  .flatMap((f) => [...readFileSync(join(schemaDir, f), "utf-8").matchAll(/CREATE (?:VIRTUAL )?TABLE (?:IF NOT EXISTS )?(\w+)/g)])
  .map((m) => m[1])
  .filter((t) => !/_v\d+$/.test(t)); // copies made only to change a CHECK
expect("architecture/database", tables, "table");

// Config keys: dataclass fields of each group, and the top-level ones.
const config = code("src/agent_mem/core/config.py");
const groups: Record<string, string> = {
  Budgets: "budgets", Retrieval: "retrieval", Retention: "retention", Limits: "limits",
  Rules: "rules", Semantic: "semantic", Observe: "observe", Viewer: "viewer",
};
const fieldsOf = (cls: string) => {
  const body = config.split(new RegExp(`^class ${cls}\\b.*$`, "m"))[1]?.split(/^(?:class |def |@dataclass)/m)[0] ?? "";
  return [...body.matchAll(/^    (\w+): /gm)].map((m) => m[1]);
};
const keys = Object.entries(groups).flatMap(([cls, prefix]) => fieldsOf(cls).map((f) => `${prefix}.${f}`));
const topLevel = fieldsOf("Config").filter((f) => !["data_dir", "warnings", ...Object.values(groups)].includes(f));
expect("configuration/config-json", [...keys, ...topLevel.map((k) => `\`${k}\``)], "config key");

// Config defaults: the "all defaults" block must hold each field's literal default (a changed default went unnoticed
// for days: names matched, values did not).
const literal = (raw: string): unknown => {
  const value = raw.replace(/\s+#.*$/, "").replace(/^field\(default_factory=lambda: (.*)\)$/, "$1");
  try {
    return JSON.parse(value.replace(/(\d)_(\d)/g, "$1$2").replace(/\bTrue\b/g, "true").replace(/\bFalse\b/g, "false"));
  } catch {
    return undefined; // not a plain literal; the key check above still covers it
  }
};
const defaultsOf = (cls: string) => {
  const body = config.split(new RegExp(`^class ${cls}\\b.*$`, "m"))[1]?.split(/^(?:class |def |@dataclass)/m)[0] ?? "";
  return [...body.matchAll(/^    (\w+): [^=\n]+= (.+)$/gm)].map((m) => [m[1], literal(m[2])] as const);
};
const block = doc("configuration/config-json").match(/```json title="config\.json \(all defaults\)"\n([\s\S]*?)```/)?.[1];
const documented = block ? JSON.parse(block) : {};
for (const [cls, prefix] of [["Config", ""], ...Object.entries(groups)]) {
  for (const [name, value] of defaultsOf(cls)) {
    const shown = prefix ? documented[prefix]?.[name] : documented[name];
    if (value !== undefined && JSON.stringify(shown) !== JSON.stringify(value))
      missing.push(`configuration/config-json: default ${prefix ? `${prefix}.` : ""}${name} is ${JSON.stringify(value)}, docs say ${JSON.stringify(shown)}`);
    const row = doc("configuration/config-json").match(new RegExp(`^\\| \`${prefix ? `${prefix}\\.` : ""}${name}\` \\| \`([^\`]*)\` \\|`, "m"));
    if (value !== undefined && row && JSON.stringify(literal(row[1]) ?? row[1]) !== JSON.stringify(value))
      missing.push(`configuration/config-json: table default ${prefix ? `${prefix}.` : ""}${name} is ${JSON.stringify(value)}, docs say ${row[1]}`);
  }
}

// CLI: every sub-command and every option of it.
const cli = code("src/agent_mem/cli/__init__.py");
const sections = cli.split(/sub\.add_parser\(/).slice(1);
const commands: string[] = [];
const options: string[] = [];
for (const section of sections) {
  const name = section.match(/^"([\w-]+)"/)?.[1];
  if (!name) continue;
  commands.push(`## ${name}`);
  for (const m of section.matchAll(/add_argument\(\s*"(--[\w-]+)"/g)) options.push(m[1]);
}
expect("configuration/cli", commands, "command");
expect("configuration/cli", [...options, "--data-dir", "## hook"], "option");

// Environment variables read anywhere in the package.
const envs = new Set<string>();
const walk = (dir: string): void => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "__pycache__") walk(path);
    else if (entry.name.endsWith(".py")) for (const m of readFileSync(path, "utf-8").matchAll(/AGENT_MEM_[A-Z_]+/g)) envs.add(m[0]);
  }
};
walk(join(src, "src/agent_mem"));
expect("configuration/environment", envs, "variable");

// MCP tools.
const tools = [...code("src/agent_mem/mcp/server.py").matchAll(/def (mem_\w+)\(/g)].map((m) => m[1]);
expect("architecture/search", tools, "MCP tool");
expect("using/search-and-mcp", tools, "MCP tool");

// Hook events per agent.
const hookKeys = (path: string) => Object.keys(JSON.parse(code(path)).hooks);
expect("agents/claude-code", hookKeys("plugins/claude/hooks/hooks.json").map((e) => `\`${e}\``), "Claude Code event");
expect("agents/codex", hookKeys("plugins/codex/hooks.json").map((e) => `\`${e}\``), "Codex event");
expect("agents/copilot", hookKeys("plugins/copilot/hooks/hooks.json").map((e) => `\`${e}\``), "Copilot event");
const opencode = [...code("plugins/opencode/agent-mem.ts").matchAll(/callHook\("([\w.]+)"/g)].map((m) => `\`${m[1]}\``);
expect("agents/opencode", opencode, "OpenCode event");
for (const [agent, path] of [["Claude Code", "plugins/claude/hooks/hooks.json"], ["Copilot", "plugins/copilot/hooks/hooks.json"]] as const)
  expect("architecture/hook-lifecycle", hookKeys(path), `${agent} event`);

const counts = { tables: tables.length, configKeys: keys.length + topLevel.length, commands: commands.length, options: new Set(options).size, envs: envs.size, tools: tools.length };
if (missing.length) {
  console.error(`Docs miss ${missing.length} item(s):\n  ${missing.join("\n  ")}`);
  process.exit(1);
}
console.log(`coverage ok: ${JSON.stringify(counts)}`);
