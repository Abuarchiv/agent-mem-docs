import { area, arrow, box, layout } from "./_lib";
// memory.db tables by group, with the main references (schema 001–008).
const t = (id: string, x: number, y: number, h: number, text: string, color: Parameters<typeof box>[6]) =>
  box(id, x, y, 250, h, text, color, { roundness: null, label: { text, fontSize: 13, textAlign: "left", verticalAlign: "top" } });
export default layout([
  ...area("g1", 0, 0, 560, 300, "projects and sessions"),
  t("projects", 20, 50, 110, "projects\nid PK · remote · name\nroot · created_at", "sand"),
  t("paths", 20, 180, 90, "project_paths\npath PK · project_id", "sand"),
  t("sessions", 290, 50, 230, "sessions\nid PK  (<harness>:<native id>)\nharness · native_id\nproject_id · branch\nstarted_at · ended_at\nlast_event_at · summarized_at\ntitle · summary_json", "sand"),
  ...area("g2", 600, 0, 560, 420, "episodes"),
  t("turns", 620, 50, 270, "turns  (T<n>)\nid PK · session_id · project_id\nstarted_at · ended_at\nprompt · answer\noutcome open|ok|error|unknown\nimportance · trust\nfiles_json · commands_json\nerrors_json · indexed_at\ntitle · type · work_tokens", "blue"),
  t("events", 890, 50, 330, "events\nid PK · session_id · turn_id\nts · kind · tool · tool_use_id\ncommand_key · exit_code\nerror_sig · resolved\nfiles_json · payload · trust\ndedupe_key UNIQUE · trimmed", "blue"),
  ...area("g3", 0, 340, 560, 420, "memories and search"),
  t("memories", 20, 390, 330, "memories  (M<n>)\nid PK · project_id · kind\ntitle · body · source · trust\nimportance · turn_id · origin\nvalid_from · invalid_at\nsuperseded_by · created_at\ndedupe_key UNIQUE", "yellow"),
  t("keys", 290, 390, 90, "search_keys\nid PK · owner_type · owner_id", "yellow"),
  t("fts", 290, 500, 90, "search_fts (FTS5, trigram)\nrowid = search_keys.id · text", "yellow"),
  t("vectors", 290, 610, 110, "vectors\n(owner_type, owner_id) PK\nmodel · vec BLOB", "yellow"),
  ...area("g4", 600, 460, 560, 300, "graph and learning"),
  t("entities", 620, 510, 110, "entities\nid · project_id · kind\nfile|command|error|package · key", "lilac"),
  t("links", 620, 640, 90, "links\nowner_type · owner_id · entity_id", "lilac"),
  t("edges", 890, 510, 90, "edges\na < b · weight · updated_at", "lilac"),
  t("accesses", 890, 620, 120, "accesses\nowner · ts · kind · session_id\ncreated|shown|injected|get\nused|cited|warned", "lilac"),
  ...area("g5", 1200, 0, 300, 760, "rules, observer, system"),
  t("recipes", 1225, 50, 100, "recipes\nerror_sig · command_key\nfiles_json · successes", "green"),
  t("rules", 1225, 165, 100, "rules\nkind avoid_command · pattern\nmessage · evidence · enabled", "green"),
  t("profile", 1225, 280, 80, "profile\nproject · key cmd:* · value · count", "green"),
  t("queue", 1225, 375, 90, "observe_queue\nturn_id PK · state · attempts\nnext_try · lease_until", "pink"),
  t("calls", 1225, 480, 80, "observe_calls · observe_forget", "pink"),
  t("concepts", 1225, 575, 80, "concepts · concept_links\nrelations", "pink"),
  t("sys", 1225, 670, 70, "anchors · health · meta", "sand"),
  arrow("paths", "projects"), arrow("sessions", "projects"), arrow("turns", "sessions"), arrow("events", "turns"),
  arrow("memories", "turns", "turn_id"), arrow("keys", "fts"), arrow("links", "entities"),
]);
