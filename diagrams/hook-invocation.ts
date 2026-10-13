import { arrow, box, layout } from "./_lib";
// What one `agent-mem hook` process does, start to exit.
export default layout([
  box("stdin", 0, 0, 250, 60, "stdin JSON\n(≤ limits.stdin_bytes)", "blue"),
  box("off", 330, 0, 270, 60, "AGENT_MEM_INTERNAL or\nAGENT_MEM_DISABLE set?", "sand"),
  box("silent", 680, 0, 200, 60, "print nothing,\nexit 0", "sand"),
  box("norm", 330, 110, 270, 60, "normalize(harness, payload)\n→ Event", "pink"),
  box("quar", 680, 110, 200, 60, "invalid → quarantine/\nnote, print nothing", "coral"),
  box("behind", 330, 220, 270, 60, "earlier event of this session\nwaiting in spool?", "sand"),
  box("queue", 680, 220, 200, 60, "spool this one too\n(keep order)", "yellow"),
  box("worker", 330, 330, 270, 70, "worker thread:\ncapture.apply + spawns", "pink"),
  box("dead", 680, 335, 200, 60, "deadline passed →\nspool, print nothing", "yellow"),
  box("render", 330, 450, 270, 60, "render() per harness\n+ terminal panel", "green"),
  box("exit", 330, 560, 270, 50, "stdout, os._exit(0)", "blue"),
  arrow("stdin", "off"), arrow("off", "silent", "yes"), arrow("off", "norm", "no"),
  arrow("norm", "quar", "PayloadError"), arrow("norm", "behind"),
  arrow("behind", "queue", "yes"), arrow("behind", "worker", "no"),
  arrow("worker", "dead", "> hook_deadline_ms"), arrow("worker", "render"),
  arrow("render", "exit"),
]);
