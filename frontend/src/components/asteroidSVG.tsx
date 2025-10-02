'use client';

import React, { useMemo } from 'react';

/*  helpers (embedded) */
type Pt = [number, number];

function hash32(str: string) {
  let h = 0x811c9dc5 >>> 0; // FNV-1a
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function rnd() {
    t = (t + 0x6d2b79f5) >>> 0;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function hlsToRgb(h: number, l: number, s: number) {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v] as const;
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const chan = (t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const r = Math.round(chan(h + 1 / 3) * 255);
  const g = Math.round(chan(h) * 255);
  const b = Math.round(chan(h - 1 / 3) * 255);
  return [r, g, b] as const;
}

function rgb(r: number, g: number, b: number) {
  return `rgb(${r}, ${g}, ${b})`;
}

function chaikin(points: Pt[], iterations = 2): Pt[] {
  let pts = points.slice();
  for (let k = 0; k < iterations; k++) {
    const out: Pt[] = [];
    for (let i = 0; i < pts.length; i++) {
      const p0 = pts[i];
      const p1 = pts[(i + 1) % pts.length];
      const q: Pt = [0.75 * p0[0] + 0.25 * p1[0], 0.75 * p0[1] + 0.25 * p1[1]];
      const r: Pt = [0.25 * p0[0] + 0.75 * p1[0], 0.25 * p0[1] + 0.75 * p1[1]];
      out.push(q, r);
    }
    pts = out;
  }
  return pts;
}

function centroid(poly: Pt[]): Pt {
  const n = poly.length;
  let x = 0,
    y = 0;
  for (const p of poly) {
    x += p[0];
    y += p[1];
  }
  return [x / n, y / n];
}

function pointInPolygon(x: number, y: number, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 1e-9) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function pointSegmentDistance(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  const vx = x2 - x1,
    vy = y2 - y1;
  const wx = px - x1,
    wy = py - y1;
  const c1 = vx * wx + vy * wy;
  if (c1 <= 0) return Math.hypot(px - x1, py - y1);
  const c2 = vx * vx + vy * vy;
  if (c2 <= c1) return Math.hypot(px - x2, py - y2);
  const t = c1 / c2;
  const projx = x1 + t * vx,
    projy = y1 + t * vy;
  return Math.hypot(px - projx, py - projy);
}

function minDistanceToEdges(px: number, py: number, poly: Pt[]) {
  let m = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    m = Math.min(m, pointSegmentDistance(px, py, x1, y1, x2, y2));
  }
  return m;
}

function normalizeToBox(points: Pt[], size: number, margin = 12): Pt[] {
  const xs = points.map(p => p[0]);
  const ys = points.map(p => p[1]);
  const minx = Math.min(...xs),
    maxx = Math.max(...xs);
  const miny = Math.min(...ys),
    maxy = Math.max(...ys);
  const w = Math.max(1e-6, maxx - minx);
  const h = Math.max(1e-6, maxy - miny);

  const avail = size - 2 * margin;
  const scale = Math.min(avail / w, avail / h);

  const bx = (minx + maxx) / 2;
  const by = (miny + maxy) / 2;
  const cx = size / 2,
    cy = size / 2;

  return points.map(([x, y]) => [(x - bx) * scale + cx, (y - by) * scale + cy]);
}
/*  end helpers */

type Props = {
  id: string; // stable seed (e.g. neo_reference_id)
  size?: number; // px
  smoothIters?: number; // 1-3 (def 2)
  roundnessBias?: number; // 0-1 probability to go "rounder"
  variant?: 'asteroid' | 'comet';
  debugBounds?: boolean;
};

export default function AsteroidSVG({
  id,
  size = 200,
  smoothIters = 2,
  roundnessBias,
  variant = 'asteroid',
  debugBounds = false,
}: Props) {
  const svg = useMemo(() => {
    const rnd = mulberry32(hash32(id));

    // shape: mix round vs jagged
    const bias = roundnessBias ?? 0.45;
    const roll = rnd();
    let sides: number;
    let jitter: number;
    if (roll < bias) {
      sides = 14 + Math.floor(rnd() * 8); // 14–21
      jitter = size * 0.075;
    } else {
      sides = 8 + Math.floor(rnd() * 7); // 8–14
      jitter = size * 0.16;
    }
    const baseR = size * 0.42;

    // base polygon around center
    const pts: Pt[] = [];
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2;
      const r = baseR + (rnd() * 2 - 1) * jitter;
      pts.push([size / 2 + Math.cos(a) * r, size / 2 + Math.sin(a) * r]);
    }

    // smooth & normalize (prevents clipping)
    let spts = chaikin(pts, smoothIters);
    spts = normalizeToBox(spts, size, 14);

    // color palette (quantized hue bins for diversity)
    const hueBin = Math.floor(rnd() * 18); // 20 deg steps
    const h = hueBin / 18;
    const s = Math.min(0.9, Math.max(0.5, 0.55 + rnd() * 0.3));
    const l = Math.min(0.62, Math.max(0.32, 0.45 + (rnd() - 0.5) * 0.18));
    const [r1, g1, b1] = hlsToRgb(h, l, s);
    const [r2, g2, b2] = hlsToRgb(
      (h + 355 / 360) % 1,
      Math.max(0.22, l - 0.12),
      Math.min(0.95, s + 0.05)
    );
    const fill = rgb(r1, g1, b1);
    const stroke = rgb(r2, g2, b2);

    // path
    const pathD =
      spts
        .map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`)
        .join(' ') + ' Z';

    // lighting gradient id
    const gradId = `light-${id}`;

    // optional comet tail
    const tail = (() => {
      if (variant !== 'comet') return null;
      const [cx, cy] = centroid(spts);
      const angle = rnd() * Math.PI * 2;
      const len = size * (0.22 + rnd() * 0.12);
      const tx = cx - Math.cos(angle) * len;
      const ty = cy - Math.sin(angle) * len;
      const [tr, tg, tb] = hlsToRgb(
        (h + 0.02) % 1,
        Math.min(0.75, l + 0.2),
        Math.min(1, s + 0.1)
      );
      return { cx, cy, tx, ty, color: `rgba(${tr}, ${tg}, ${tb}, 0.18)` };
    })();

    // crater placement (inside fitted polygon, spaced, edge-safe)
    const [cx0, cy0] = centroid(spts);
    const xs = spts.map(p => p[0]),
      ys = spts.map(p => p[1]);
    const approxR =
      Math.min(
        Math.max(...xs) - Math.min(...xs),
        Math.max(...ys) - Math.min(...ys)
      ) / 2;

    const craterCount = 3 + Math.floor(rnd() * 4); // 3–6
    const placed: Array<{ x: number; y: number; r: number; o: number }> = [];
    const attempts = craterCount * 200;
    for (let k = 0; k < attempts && placed.length < craterCount; k++) {
      const ang = rnd() * Math.PI * 2;
      const rad = (0.1 + rnd() * 0.75) * (approxR * 0.95);
      const x = cx0 + Math.cos(ang) * rad;
      const y = cy0 + Math.sin(ang) * rad;
      if (!pointInPolygon(x, y, spts)) continue;

      const rcr = 3 + rnd() * 5;
      if (minDistanceToEdges(x, y, spts) < rcr + 2) continue;

      let ok = true;
      const minD2 = (rcr + 3) ** 2;
      for (const p of placed) {
        const dx = p.x - x,
          dy = p.y - y;
        if (dx * dx + dy * dy < minD2) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;

      placed.push({ x, y, r: rcr, o: 0.22 + rnd() * 0.25 });
    }

    const craterCircles = placed
      .map(
        c =>
          `<circle cx="${c.x.toFixed(2)}" cy="${c.y.toFixed(2)}" r="${c.r.toFixed(
            2
          )}" fill="black" fill-opacity="${c.o.toFixed(2)}" />`
      )
      .join('');

    const cometTail = tail
      ? `<line x1="${tail.cx.toFixed(2)}" y1="${tail.cy.toFixed(
          2
        )}" x2="${tail.tx.toFixed(2)}" y2="${tail.ty.toFixed(
          2
        )}" stroke="${tail.color}" stroke-width="${(size * 0.1).toFixed(
          2
        )}" stroke-linecap="round" />`
      : '';

    const debugRect = debugBounds
      ? `<rect x="1" y="1" width="${(size - 2).toFixed(0)}" height="${(
          size - 2
        ).toFixed(
          0
        )}" fill="none" stroke="rgba(0,0,0,0.25)" stroke-dasharray="4 4"/>`
      : '';

    return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Procedural ${variant}">
  <defs>
    <radialGradient id="${gradId}" cx="32%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.30" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.15" />
    </radialGradient>
  </defs>
  ${debugRect}
  ${cometTail}
  <g>
    <path d="${pathD}" fill="${fill}" stroke="${stroke}" stroke-width="2" />
    <path d="${pathD}" fill="url(#${gradId})" />
    ${craterCircles}
  </g>
</svg>`.trim();
  }, [id, size, smoothIters, roundnessBias, variant, debugBounds]);

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}
