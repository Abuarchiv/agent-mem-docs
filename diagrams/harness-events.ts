import { arrow, box, layout, text } from "./_lib";
// Each harness's event names map onto eight internal kinds (hooks/normalize/*.py).
const kinds = ["session_start", "prompt", "pre_tool", "tool", "stop", "subagent_stop", "compact", "session_end"];
const rows: [string, string[]][] = [
  ["Claude Code / Codex", ["SessionStart · SubagentStart", "UserPromptSubmit", "PreToolUse", "PostToolUse · PostToolUseFailure", "Stop", "SubagentStop", "PreCompact (Codex: PostCompact)", "SessionEnd"]],
  ["Copilot CLI", ["sessionStart · subagentStart", "userPromptSubmitted", "preToolUse", "postToolUse · …Failure · errorOccurred", "agentStop", "subagentStop", "preCompact", "sessionEnd"]],
  ["OpenCode plugin", ["session.start", "chat.message", "tool.before", "tool.after", "session.idle", "—", "session.compacting", "session.end"]],
];
const els: Record<string, unknown>[] = [];
kinds.forEach((k, i) => els.push(box(`k${i}`, 760, i * 70, 190, 52, k, "pink")));
rows.forEach(([name, names], r) => {
  els.push(text(r * 250, -40, name, 16));
  names.forEach((n, i) => {
    if (n === "—") return;
    els.push(box(`h${r}-${i}`, r * 250, i * 70, 230, 52, n, "blue", { label: { text: n, fontSize: 13 } }));
  });
});
for (let i = 0; i < kinds.length; i++) if (i !== 5) els.push(arrow(`h2-${i}`, `k${i}`));
els.push(arrow("h1-5", "k5"));
export default layout(els);
