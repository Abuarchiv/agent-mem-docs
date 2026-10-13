import { arrow, box, db, layout, text } from "./_lib";
// The five kinds of agent-mem process, who starts them and what they hold.
export default layout([
  box("agent", 0, 170, 200, 70, "coding agent", "blue"),
  box("hook", 300, 20, 300, 70, "agent-mem hook\nper event · ~65 ms", "pink"),
  box("mcp", 300, 320, 300, 70, "agent-mem mcp\none per session · stdio", "pink"),
  box("obs", 720, 0, 320, 70, "agent-mem observe --drain\nobserve.lock · exits after 90 s idle", "green"),
  box("idx", 720, 110, 320, 70, "agent-mem index --quiet\nindexer.lock · exits when done", "green"),
  box("srv", 720, 220, 320, 70, "agent-mem serve --quiet\nport 37778 · runs until stopped", "lilac"),
  box("login", 1120, 220, 230, 70, "login item\nlaunchd · systemd · Startup", "sand"),
  db("db", 760, 330, 240, 90, "memory.db"),
  arrow("agent", "hook", "event JSON"), arrow("agent", "mcp", "MCP tools"),
  arrow("hook", "obs", "Stop, SessionEnd"), arrow("hook", "idx", "Stop, spool"), arrow("hook", "srv", "SessionStart"),
  arrow("login", "srv"), arrow("mcp", "db"),
  text(0, 440, "All detached, all with AGENT_MEM_INTERNAL=1; AGENT_MEM_NO_SPAWN=1 starts none.", 14, { strokeColor: "#5E594F" }),
]);
