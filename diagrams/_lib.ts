// Small helpers over Excalidraw's element skeleton API (convertToExcalidrawElements).
export type El = Record<string, unknown>;

// The agent-mem viewer palette (src/agent_mem/ui/app.css).
export const C = {
  yellow: "#F2D35B",
  pink: "#F2B5D4",
  blue: "#AFC1F0",
  green: "#B3C177",
  sand: "#E2D9C3",
  coral: "#F6A38F",
  lilac: "#C9B8F0",
  amber: "#E9A15B",
  paper: "#FFFFFF",
  ink: "#1A1814",
  none: "transparent",
} as const;
export const INK = "#1A1814";
export type Color = keyof typeof C;

export function box(id: string, x: number, y: number, w: number, h: number, text: string, color: Color = "sand", extra: El = {}): El {
  return {
    type: "rectangle", id, x, y, width: w, height: h,
    backgroundColor: C[color], fillStyle: "solid", roundness: { type: 3 }, strokeWidth: 1,
    label: { text, fontSize: 16 }, ...extra,
  };
}

export function db(id: string, x: number, y: number, w: number, h: number, text: string, color: Color = "yellow"): El {
  return { type: "ellipse", id, x, y, width: w, height: h, backgroundColor: C[color], fillStyle: "solid", strokeWidth: 1, label: { text, fontSize: 16 } };
}

export function area(id: string, x: number, y: number, w: number, h: number, title: string): El[] {
  return [
    { type: "rectangle", id, x, y, width: w, height: h, strokeStyle: "dashed", strokeWidth: 1, roundness: { type: 3 }, backgroundColor: C.none },
    { type: "text", x: x + 14, y: y + 10, text: title, fontSize: 18, strokeColor: "#5E594F" },
  ];
}

export function arrow(from: string, to: string, label?: string, extra: El = {}): El {
  return {
    type: "arrow", x: 0, y: 0, strokeWidth: 1,
    start: { id: from }, end: { id: to },
    ...(label ? { label: { text: label, fontSize: 14 } } : {}),
    ...extra,
  };
}

export function text(x: number, y: number, value: string, size = 16, extra: El = {}): El {
  return { type: "text", x, y, text: value, fontSize: size, ...extra };
}

// Places every arrow between the borders of the two shapes it connects (the
// skeleton API binds arrows but leaves them where x/y say).
export function layout(els: El[]): El[] {
  const byId = new Map(els.filter((e) => e.id).map((e) => [e.id as string, e]));
  const edge = (e: El, dx: number, dy: number, gap: number) => {
    const hw = (e.width as number) / 2, hh = (e.height as number) / 2;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const t = e.type === "ellipse"
      ? 1 / Math.hypot(ux / hw, uy / hh)
      : Math.min(ux ? hw / Math.abs(ux) : Infinity, uy ? hh / Math.abs(uy) : Infinity);
    return [(e.x as number) + hw + ux * (t + gap), (e.y as number) + hh + uy * (t + gap)];
  };
  const center = (e: El) => [(e.x as number) + (e.width as number) / 2, (e.y as number) + (e.height as number) / 2];
  return els.map((e) => {
    if (e.type !== "arrow" || !e.start || !e.end) return e;
    const a = byId.get((e.start as El).id as string)!, b = byId.get((e.end as El).id as string)!;
    const [ax, ay] = center(a), [bx, by] = center(b);
    const [sx, sy] = edge(a, bx - ax, by - ay, 4);
    const [ex, ey] = edge(b, ax - bx, ay - by, 4);
    // Fixed points instead of bindings: Excalidraw's converter bends bound vertical arrows.
    const { start: _s, end: _e, ...rest } = e;
    return { ...rest, x: sx, y: sy, points: [[0, 0], [ex - sx, ey - sy]] };
  });
}

export interface Actor { id: string; label: string; color?: Color }
export interface Msg { from: string; to: string; text: string; dashed?: boolean }
export interface Note { note: string; over: [string, string]; color?: Color }

// A sequence diagram: actors across the top, a dashed lifeline each, one row per message or note.
export function sequence(actors: Actor[], steps: (Msg | Note)[], colW = 230, rowH = 58): El[] {
  const els: El[] = [];
  const cx = (id: string) => actors.findIndex((a) => a.id === id) * colW + (colW - 30) / 2;
  const top = 64;
  const height = top + 30 + steps.length * rowH;
  actors.forEach((a, i) => {
    els.push(box(`actor-${a.id}`, i * colW, 0, colW - 30, 52, a.label, a.color ?? "sand"));
    els.push({ type: "line", x: cx(a.id), y: top, points: [[0, 0], [0, height - top]], strokeStyle: "dashed", strokeColor: "#9A9384", strokeWidth: 1 });
  });
  steps.forEach((s, k) => {
    const y = top + 40 + k * rowH;
    if ("note" in s) {
      const [a, b] = s.over;
      const x1 = Math.min(cx(a), cx(b)) - 90, x2 = Math.max(cx(a), cx(b)) + 90;
      els.push(box(`note-${k}`, x1, y - 16, x2 - x1, rowH - 12, s.note, s.color ?? "yellow", { roundness: null, label: { text: s.note, fontSize: 14 } }));
      return;
    }
    const x1 = cx(s.from), x2 = cx(s.to);
    const dash = s.dashed ? { strokeStyle: "dashed" } : {};
    if (s.from === s.to) {
      els.push({ type: "arrow", x: x1, y: y - 10, points: [[0, 0], [46, 0], [46, 22], [4, 22]], strokeWidth: 1, ...dash });
      els.push(text(x1 + 56, y - 8, s.text, 14));
    } else {
      els.push({ type: "arrow", x: x1 + Math.sign(x2 - x1) * 4, y: y + 8, points: [[0, 0], [x2 - x1 - Math.sign(x2 - x1) * 8, 0]], strokeWidth: 1, ...dash });
      els.push(text(Math.min(x1, x2) + 14, y - 14, s.text, 14));
    }
  });
  return els;
}
