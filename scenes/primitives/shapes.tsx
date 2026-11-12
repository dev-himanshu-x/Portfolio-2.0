import type { ReactNode } from "react";

/**
 * Shared paper-cut primitives used across scenes. Every shape is drawn inside a
 * 1600x1000 viewBox so layers from different files line up exactly.
 */

export const VIEWBOX = "0 0 1600 1000";

export function Layer({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox={VIEWBOX}
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
    >
      {/* soft blur shared by the per-cluster shadows; static, so it paints once */}
      <defs>
        <filter id="pp-soft" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      {children}
    </svg>
  );
}

type Lobe = { cx: number; cy: number; r: number };

/**
 * Renders overlapping lobes as a cut-paper cluster: all shadow copies are drawn
 * once, offset and blurred together under a SINGLE filter, then the fills go on
 * top. Each cluster shadows whatever sits behind it. Grouping the shadows (vs.
 * one filter per lobe) keeps the soft look but is far cheaper, so stacked
 * clusters — the smoke plume especially — still read with depth and stay smooth.
 */
function Puffs({
  lobes,
  fill,
  shadow,
  dx,
  dy,
}: {
  lobes: Lobe[];
  fill: string;
  shadow: string;
  dx: number;
  dy: number;
}) {
  return (
    <>
      <g fill={shadow} filter="url(#pp-soft)">
        {lobes.map((c, i) => (
          <circle key={i} cx={c.cx + dx} cy={c.cy + dy} r={c.r} />
        ))}
      </g>
      <g fill={fill}>
        {lobes.map((c, i) => (
          <circle key={i} cx={c.cx} cy={c.cy} r={c.r} />
        ))}
      </g>
    </>
  );
}

// Cloud lobes, ordered back-to-front so creases fall believably.
const CLOUD_LOBES: Lobe[] = [
  { cx: 0, cy: 0, r: 46 },
  { cx: 112, cy: -30, r: 48 },
  { cx: 48, cy: -18, r: 58 },
  { cx: 150, cy: 2, r: 56 },
  { cx: 36, cy: 24, r: 52 },
  { cx: 96, cy: 20, r: 60 },
];

/** Puffy cut-paper cloud built from overlapping lobes with per-lobe shadows. */
export function Cloud({
  x,
  y,
  scale = 1,
  fill = "#FBF8F2",
  edge = "#E0D6C4",
}: {
  x: number;
  y: number;
  scale?: number;
  fill?: string;
  edge?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* flat base, with its own shadow */}
      <rect
        x={-10 + 6}
        y={2 + 8}
        width="178"
        height="44"
        rx="22"
        fill={edge}
        filter="url(#pp-soft)"
      />
      <rect x="-10" y="2" width="178" height="44" rx="22" fill={fill} />
      <Puffs lobes={CLOUD_LOBES} fill={fill} shadow={edge} dx={6} dy={8} />
    </g>
  );
}

// Smoke / billow lobes, ordered back-to-front.
const BILLOW_LOBES: Lobe[] = [
  { cx: -46, cy: 22, r: 58 },
  { cx: 200, cy: 0, r: 58 },
  { cx: 150, cy: -50, r: 72 },
  { cx: 70, cy: -30, r: 86 },
  { cx: 0, cy: 0, r: 70 },
  { cx: 120, cy: 30, r: 80 },
  { cx: 40, cy: 40, r: 70 },
];

/** Layered smoke / billow blob; each lobe shadows the one behind it. */
export function Billow({
  x,
  y,
  scale = 1,
  fill,
  shadow = "rgba(0,0,0,0.28)",
}: {
  x: number;
  y: number;
  scale?: number;
  fill: string;
  shadow?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Puffs lobes={BILLOW_LOBES} fill={fill} shadow={shadow} dx={11} dy={15} />
    </g>
  );
}

/** A single palm tree silhouette. */
export function Palm({
  x,
  y,
  scale = 1,
  fill = "#143021",
  flip = false,
}: {
  x: number;
  y: number;
  scale?: number;
  fill?: string;
  flip?: boolean;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
      fill={fill}
    >
      {/* trunk — curved lean, wide base tapering thin to the crown */}
      <path d="M-16 0 C -14 -78 0 -152 16 -212 L 28 -210 C 16 -150 8 -76 12 0 Z" />
      {/* crown sits on the leaned trunk top; every frond arches out and its
          tip bends back down, like the reference coconut palms */}
      <g transform="translate(20 -12)">
        {/* low fronds — hang below the crown */}
        <path d="M0 -200 C -58 -212 -114 -190 -144 -130 C -104 -176 -52 -190 2 -190 Z" />
        <path d="M6 -200 C 64 -212 120 -190 150 -130 C 110 -176 58 -190 4 -190 Z" />
        {/* mid fronds — long reach, tips dipping below their arch */}
        <path d="M2 -206 C -66 -250 -140 -254 -186 -202 C -134 -230 -66 -212 0 -194 Z" />
        <path d="M6 -208 C 70 -252 144 -256 190 -204 C 138 -232 70 -214 2 -196 Z" />
        {/* upper fronds — arch up and over, tips curling down */}
        <path d="M0 -212 C -44 -282 -98 -312 -150 -290 C -102 -286 -52 -250 -6 -202 Z" />
        <path d="M8 -212 C 52 -284 106 -314 158 -292 C 110 -288 60 -252 10 -202 Z" />
        {/* center-top pair (replaces the vertical spire) — arc over, tips down */}
        <path d="M0 -214 C -16 -288 -44 -328 -92 -332 C -50 -308 -20 -266 6 -210 Z" />
        <path d="M8 -214 C 26 -290 56 -330 104 -334 C 60 -310 28 -268 12 -210 Z" />
        {/* coconut cluster at the crown */}
        <circle cx="-6" cy="-204" r="6" />
        <circle cx="10" cy="-206" r="6" />
        <circle cx="2" cy="-198" r="5" />
      </g>
    </g>
  );
}

/** A simple flock of paper birds. */
export function Birds({
  points,
  fill = "#1A1A1A",
}: {
  points: Array<[number, number, number]>; // x, y, scale
  fill?: string;
}) {
  return (
    <g fill={fill}>
      {points.map(([x, y, s], i) => (
        <path
          key={i}
          transform={`translate(${x} ${y}) scale(${s})`}
          d="M0 0 C -10 -10 -22 -12 -34 -6 C -22 -2 -12 0 0 6 C 12 0 22 -2 34 -6 C 22 -12 10 -10 0 0 Z"
        />
      ))}
    </g>
  );
}
