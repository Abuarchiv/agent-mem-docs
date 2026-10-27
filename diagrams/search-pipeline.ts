import { area, arrow, box, db, layout } from "./_lib";
// memory/search.py search(): candidates, fusion, re-scoring, order, abstention.
export default layout([
  box("q", 0, 150, 200, 70, "question\n(prompt, mem_search,\nagent-mem search)", "blue"),
  box("terms", 260, 150, 220, 70, "query_terms: stop words,\nhyphen parts, ≤ 12 terms;\ntime words → window", "sand"),
  ...area("cand", 540, 0, 330, 380, "candidates"),
  box("fts", 570, 50, 270, 56, "FTS5 trigram, bm25;\nrare file and code names", "yellow"),
  box("vec", 570, 130, 270, 56, "vectors ≥ min_vector_score,\nweight 0.5 (MCP + CLI only)", "yellow"),
  box("time", 570, 210, 270, 56, "time window; tool outputs\nnaming a file (MCP + CLI)", "yellow"),
  box("graph", 570, 290, 270, 56, "graph tie: entities named,\nPersonalized PageRank", "lilac"),
  box("rrf", 930, 90, 230, 70, "weighted RRF, k = 60\nnormalized to 0..1", "pink"),
  box("score", 930, 200, 230, 90, "score = rrf × activation\n× importance × usefulness\n× trust × project boost", "pink"),
  box("order", 1220, 90, 240, 70, "order by score × coverage\n(plain + rarity) × tie", "green"),
  box("cap", 1220, 200, 240, 70, "≤ 3 turns per session,\nlimit", "green"),
  box("gate", 1220, 310, 240, 70, "confident? (hooks,\nmem_search): else abstain", "coral"),
  db("db", 260, 290, 200, 80, "memory.db"),
  arrow("q", "terms"), arrow("terms", "fts"), arrow("terms", "vec"), arrow("terms", "time"), arrow("terms", "graph"),
  arrow("fts", "rrf"), arrow("vec", "rrf"), arrow("time", "rrf"), arrow("rrf", "score"),
  arrow("graph", "order", "reorders only"), arrow("score", "order"), arrow("order", "cap"), arrow("cap", "gate"),
  arrow("db", "fts"),
]);
