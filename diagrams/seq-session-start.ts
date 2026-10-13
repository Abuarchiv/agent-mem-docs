import { sequence } from "./_lib";
export default sequence(
  [{ id: "agent", label: "Agent", color: "blue" }, { id: "hook", label: "agent-mem hook", color: "pink" }, { id: "db", label: "memory.db", color: "yellow" }, { id: "bg", label: "agent-mem serve", color: "lilac" }],
  [
    { from: "agent", to: "hook", text: "SessionStart {session_id, cwd, source}" },
    { from: "hook", to: "hook", text: "normalize, resolve project" },
    { from: "hook", to: "db", text: "upsert session, INSERT event" },
    { from: "hook", to: "db", text: "briefing queries (ranked)" },
    { from: "db", to: "hook", text: "memories, lessons, last session", dashed: true },
    { from: "hook", to: "bg", text: "spawn if :37778 is silent" },
    { from: "hook", to: "hook", text: "render ≤ budgets.session_start" },
    { from: "hook", to: "agent", text: "additionalContext + panel", dashed: true },
    { note: "past 400 ms: event goes to spool/, hook prints nothing", over: ["agent", "db"] },
  ],
);
