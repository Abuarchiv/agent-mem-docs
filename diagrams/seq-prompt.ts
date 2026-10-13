import { sequence } from "./_lib";
export default sequence(
  [{ id: "agent", label: "Agent", color: "blue" }, { id: "hook", label: "agent-mem hook", color: "pink" }, { id: "db", label: "memory.db", color: "yellow" }],
  [
    { from: "agent", to: "hook", text: "UserPromptSubmit {prompt}" },
    { from: "hook", to: "db", text: "close open turn → observe_queue" },
    { from: "hook", to: "db", text: "INSERT turns(prompt)" },
    { from: "hook", to: "hook", text: "corrections, X instead of Y, decisions" },
    { from: "hook", to: "db", text: "search(prompt): FTS5 + graph" },
    { from: "db", to: "hook", text: "hits", dashed: true },
    { from: "hook", to: "hook", text: "keep confident hits only" },
    { from: "hook", to: "agent", text: "additionalContext or nothing", dashed: true },
  ],
);
