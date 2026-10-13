import { sequence } from "./_lib";
export default sequence(
  [{ id: "agent", label: "Agent", color: "blue" }, { id: "hook", label: "agent-mem hook", color: "pink" }, { id: "db", label: "memory.db", color: "yellow" }, { id: "obs", label: "agent-mem observe", color: "green" }, { id: "idx", label: "agent-mem index", color: "green" }],
  [
    { from: "agent", to: "hook", text: "Stop {last_assistant_message}" },
    { from: "hook", to: "db", text: "turns.answer, cited T/M ids" },
    { from: "hook", to: "db", text: "close turn → observe_queue" },
    { from: "hook", to: "obs", text: "spawn --drain (15 s throttle)" },
    { from: "hook", to: "idx", text: "spawn --quiet (60 s throttle)" },
    { from: "hook", to: "agent", text: "nothing (async)", dashed: true },
    { from: "obs", to: "db", text: "facts, title, summary" },
  ],
);
