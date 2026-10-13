import { sequence } from "./_lib";
export default sequence(
  [{ id: "agent", label: "Agent", color: "blue" }, { id: "hook", label: "agent-mem hook", color: "pink" }, { id: "db", label: "memory.db", color: "yellow" }],
  [
    { from: "agent", to: "hook", text: "PreToolUse {tool_name, tool_input}" },
    { from: "hook", to: "hook", text: "analyze_tool: command, files" },
    { from: "hook", to: "db", text: "rules for the tools it runs" },
    { note: "enabled rule → permissionDecision: deny (tool never runs)", over: ["agent", "db"], color: "coral" },
    { from: "hook", to: "db", text: "memories linked to ≤ 3 files" },
    { from: "db", to: "hook", text: "dead ends, decisions, lessons", dashed: true },
    { from: "hook", to: "agent", text: "note + file history", dashed: true },
  ],
);
