import { sequence } from "./_lib";
export default sequence(
  [{ id: "agent", label: "Agent", color: "blue" }, { id: "hook", label: "agent-mem hook", color: "pink" }, { id: "db", label: "memory.db", color: "yellow" }, { id: "obs", label: "agent-mem observe", color: "green" }],
  [
    { from: "agent", to: "hook", text: "SessionEnd {reason}" },
    { from: "hook", to: "db", text: "close open turn, sessions.ended_at" },
    { from: "hook", to: "obs", text: "spawn --drain" },
    { from: "hook", to: "agent", text: "session saved · N requests · M files", dashed: true },
  ],
);
