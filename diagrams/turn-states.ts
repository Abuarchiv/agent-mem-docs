import { arrow, area, box, layout } from "./_lib";
// A turn's outcome and its row in observe_queue.
export default layout([
  ...area("t", 0, 0, 1000, 300, "turns.outcome"),
  box("open", 30, 120, 140, 56, "open", "blue"),
  box("ok", 420, 40, 160, 50, "ok", "green"),
  box("error", 420, 120, 160, 50, "error", "coral"),
  box("unknown", 420, 200, 160, 50, "unknown", "sand"),
  arrow("open", "ok", "Stop / SessionEnd"),
  arrow("open", "error", "test/build still failing"),
  arrow("open", "unknown", "next prompt or 30 min idle"),
  ...area("q", 0, 360, 1000, 300, "observe_queue.state (one row per closed turn)"),
  box("pending", 30, 480, 160, 56, "pending", "yellow"),
  box("running", 380, 480, 160, 56, "running", "pink"),
  box("done", 760, 400, 200, 50, "done (facts)", "green"),
  box("raw", 760, 480, 200, 50, "raw (word for word)", "sand"),
  box("failed", 760, 560, 200, 50, "failed", "coral"),
  arrow("pending", "running", "lease 900 s"),
  arrow("running", "done"), arrow("running", "raw", "no model stage"), arrow("running", "failed", "after backoff"),
  arrow("open", "pending", "closing a turn queues it", { strokeStyle: "dashed" }),
  arrow("failed", "pending", "observe --retry-failed", { strokeStyle: "dashed" }),
]);
