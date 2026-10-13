import { sequence } from "./_lib";
export default sequence(
  [{ id: "agent", label: "Agent", color: "blue" }, { id: "hook", label: "agent-mem hook", color: "pink" }, { id: "db", label: "memory.db", color: "yellow" }],
  [
    { from: "agent", to: "hook", text: "PreCompact {trigger}" },
    { from: "hook", to: "db", text: "attach event to the open turn" },
    { from: "agent", to: "hook", text: "SessionStart {source: compact}" },
    { from: "hook", to: "db", text: "goal, decisions, still failing, files" },
    { from: "hook", to: "agent", text: "compact block ≤ budgets.compact", dashed: true },
  ],
);
