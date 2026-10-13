import { arrow, box, layout, text } from "./_lib";
// Which CLI writes facts for which agent (observe.cross_vendor = false).
export default layout([
  box("c", 0, 0, 200, 56, "Claude Code turn", "blue"),
  box("x", 0, 100, 200, 56, "Codex turn", "blue"),
  box("p", 0, 200, 200, 56, "Copilot turn", "blue"),
  box("o", 0, 300, 200, 56, "OpenCode turn", "blue"),
  box("cc", 330, 0, 330, 56, "claude -p … --model haiku", "pink"),
  box("xx", 330, 100, 330, 56, "codex exec … -m gpt-6-luna\n-c model_reasoning_effort=low", "pink"),
  box("pp", 330, 200, 330, 56, "copilot -s --model auto\n--auto-tier efficiency", "pink"),
  box("ol", 330, 300, 330, 56, "ollama (only if added to providers)", "sand"),
  box("raw", 780, 300, 260, 56, "raw: saved word for word", "coral"),
  box("facts", 780, 100, 260, 56, "facts in memory.db", "green"),
  arrow("c", "cc"), arrow("x", "xx"), arrow("p", "pp"), arrow("o", "ol"),
  arrow("cc", "facts"), arrow("xx", "facts"), arrow("pp", "facts"),
  arrow("ol", "raw", "no stage"),
  text(330, 380, "Model refused (plan, old CLI): one more try with the CLI's own default.\nQuota or login error: stage paused for observe.pause_minutes (60); turns wait.", 14, { strokeColor: "#5E594F" }),
]);
