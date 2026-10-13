import { area, arrow, box, db, layout } from "./_lib";
// The hook only records; the model call happens later in a separate process.
export default layout([
  ...area("fast", 0, 0, 520, 300, "Hook (fast, ~65 ms with Python start)"),
  box("f1", 30, 60, 460, 50, "1. read stdin, normalize to an Event", "pink"),
  box("f2", 30, 130, 460, 50, "2. capture.apply in one transaction", "pink"),
  box("f3", 30, 200, 460, 50, "3. print context / deny / panel, exit 0", "pink"),
  db("queue", 600, 110, 220, 90, "observe_queue\n(pending)"),
  ...area("slow", 900, 0, 520, 300, "Observer (slow, one model call per bundle)"),
  box("s1", 930, 60, 460, 50, "1. lease up to 5 closed turns", "green"),
  box("s2", 930, 130, 460, 50, "2. claude -p / codex exec / copilot -s", "green"),
  box("s3", 930, 200, 460, 50, "3. facts, title, summary into SQLite", "green"),
  arrow("f2", "queue", "Stop closes the turn"),
  arrow("queue", "s1", "agent-mem observe --drain"),
]);
