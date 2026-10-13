import { area, arrow, box, db, layout } from "./_lib";
// One run of `agent-mem observe --drain`, from lock to exit.
export default layout([
  box("lock", 0, 0, 260, 56, "take observe.lock\n(else exit: skipped)", "sand"),
  box("nice", 0, 90, 260, 56, "lower priority (nice 10)", "sand"),
  box("reidx", 0, 180, 260, 56, "embedder changed?\nrebuild mem0 from SQLite", "sand"),
  box("forget", 0, 270, 260, 56, "drain observe_forget\n(deleted facts out of Qdrant)", "sand"),
  ...area("loop", 330, -20, 760, 400, "loop until idle_seconds (90) without work"),
  box("lease", 360, 30, 300, 56, "lease ≤ bundle_turns (5) turns\nof one session, lease 900 s", "yellow"),
  box("build", 360, 120, 300, 56, "build bundles\n(≤ bundle_tokens 20,000)", "yellow"),
  box("chain", 360, 210, 300, 56, "provider chain for the harness", "pink"),
  box("extract", 720, 30, 340, 56, "mem0 extract (purpose: extract)", "green"),
  box("mirror", 720, 120, 340, 56, "mirror facts into SQLite + done\n(one transaction)", "green"),
  box("work", 720, 210, 340, 56, "work log: titles, summary, lessons\n(purpose: summary)", "green"),
  box("raw", 360, 300, 300, 50, "no stage left → raw summary", "coral"),
  box("review", 1160, 60, 260, 56, "daily review per project\n(purpose: review)", "blue"),
  box("graph", 1160, 150, 260, 56, "graph: 3 batches of 40\n(purpose: graph)", "blue"),
  box("forget2", 1160, 240, 260, 56, "drain observe_forget again", "sand"),
  db("db", 760, 330, 260, 90, "memory.db"),
  arrow("lock", "nice"), arrow("nice", "reidx"), arrow("reidx", "forget"), arrow("forget", "lease"),
  arrow("lease", "build"), arrow("build", "chain"), arrow("chain", "extract"), arrow("extract", "mirror"), arrow("mirror", "work"),
  arrow("chain", "raw"), arrow("work", "db"), arrow("raw", "db"),
  arrow("extract", "review", "queue empty"), arrow("review", "graph"), arrow("graph", "forget2"),
]);
