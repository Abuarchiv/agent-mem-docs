import { arrow, box, layout } from "./_lib";
// What agent-mem learns without a model, and where it shows up again.
export default layout([
  box("corr", 0, 0, 260, 60, "\"use pnpm instead of npm\"\n(typed or extracted)", "blue"),
  box("fail", 0, 100, 260, 60, "test/build fails, then\nthe same tool passes", "blue"),
  box("rev", 0, 200, 260, 60, "git revert / restore /\ncheckout -- / reset --hard", "blue"),
  box("acc", 0, 300, 260, 60, "shown, injected, get,\nused, cited", "blue"),
  box("co", 0, 400, 260, 60, "files, commands, errors\nin one turn", "blue"),
  box("rule", 360, 0, 260, 60, "rules (avoid_command)\n+ preference after 2x", "yellow"),
  box("recipe", 360, 100, 260, 60, "recipes\n(error_sig → files changed)", "yellow"),
  box("dead", 360, 200, 260, 60, "dead_end memory\nlinked to the files", "yellow"),
  box("stats", 360, 300, 260, 60, "activation + usefulness\nper memory and turn", "yellow"),
  box("edges", 360, 400, 260, 60, "Hebbian edges\nw ← w + 0.1 (1 − w)", "yellow"),
  box("pre", 720, 0, 280, 60, "PreToolUse: note or deny", "green"),
  box("post", 720, 100, 280, 60, "PostToolUse: \"fixed before by…\"", "green"),
  box("hist", 720, 200, 280, 60, "file history before read/edit", "green"),
  box("rank", 720, 300, 280, 60, "every ranking and the briefing", "green"),
  box("ppr", 720, 400, 280, 60, "graph tie, PageRank", "green"),
  arrow("corr", "rule"), arrow("fail", "recipe"), arrow("rev", "dead"), arrow("acc", "stats"), arrow("co", "edges"),
  arrow("rule", "pre"), arrow("recipe", "post"), arrow("dead", "hist"), arrow("stats", "rank"), arrow("edges", "ppr"),
]);
