import { sequence } from "./_lib";
export default sequence(
  [{ id: "agent", label: "Agent", color: "blue" }, { id: "hook", label: "agent-mem hook", color: "pink" }, { id: "db", label: "memory.db", color: "yellow" }],
  [
    { from: "agent", to: "hook", text: "PostToolUse {tool_response | error}" },
    { from: "hook", to: "hook", text: "exit code, failed?, error signature" },
    { from: "hook", to: "db", text: "UPDATE event: turn, command, files" },
    { from: "hook", to: "db", text: "failed: look up recipe by error_sig" },
    { from: "hook", to: "agent", text: "seen before, fixed by changing …", dashed: true },
    { from: "hook", to: "db", text: "passed after failing: resolve, recipe +1" },
    { from: "hook", to: "db", text: "git revert / checkout: dead end" },
  ],
);
