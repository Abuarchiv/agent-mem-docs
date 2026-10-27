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
  box("oc", 330, 300, 330, 56, "opencode run … --agent plan\n--model opencode/big-pickle", "pink"),
  box("ol", 330, 400, 330, 56, "ollama (only if added to providers)", "sand"),
  box("facts", 780, 100, 260, 56, "facts in memory.db", "green"),
  arrow("c", "cc"), arrow("x", "xx"), arrow("p", "pp"), arrow("o", "oc"),
  arrow("cc", "facts"), arrow("xx", "facts"), arrow("pp", "facts"), arrow("oc", "facts"), arrow("ol", "facts"),
  text(330, 480, "Model refused (plan, old CLI): one more try with the CLI's own default.\nQuota or login error: stage paused for observe.pause_minutes (60); turns wait.\nNo CLI of the chain installed: the turn is saved word for word (raw).", 14, { strokeColor: "#5E594F" }),
]);
