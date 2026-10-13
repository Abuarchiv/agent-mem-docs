import { arrow, box, layout, text } from "./_lib";
// The three MCP layers an agent uses, cheapest first.
export default layout([
  box("s", 0, 0, 300, 90, "1. mem_search(query)\nids, dates, one-line titles\n~20–40 tokens per hit", "yellow"),
  box("t", 380, 0, 300, 90, "2. mem_timeline(id)\nwhat came before and after\nin the same session", "pink"),
  box("g", 760, 0, 300, 90, "3. mem_get(ids)\nfull text, actions, provenance,\nfile staleness (≤ 10 ids)", "green"),
  arrow("s", "t", "need context?"), arrow("t", "g", "need details?"),
  text(0, 130, "Ids from the briefing or a cited T12 / M3 can go straight to mem_get.\nThe briefing prints (+N tok): what opening an entry would cost.", 15, { strokeColor: "#5E594F" }),
]);
