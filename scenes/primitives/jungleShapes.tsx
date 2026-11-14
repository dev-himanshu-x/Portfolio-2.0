/**
 * Paper-cut primitives for the jungle waterfall scene (after waterfall.jpg):
 * hazy olive mountains, dense green canopy walls, a cascading center river,
 * rounded rocks, big tropical leaves, orange blooms, and small paper animals.
 * Same 1600×1000 viewBox and flat cut-paper look as shapes.tsx.
 */

export const JUNGLE = {
  skyTop: "#FBE8CC",
  skyGlow: "#F6D3A0",
  mtnFar: "#F3C687",
  mtn: "#E89A38",
  mtnLt: "#F0B35A",
  sage: "#A8BC8E",
  tealLt: "#63B0A0",
  teal: "#3E8A7C",
  tealDk: "#2A6B60",
  tealInk: "#1E4F48",
  river: "#8FD8E6",
  ripple: "#5FB9CC",
  gold: "#D9A946",
  haze: "#F8ECD6",
  canopyBack: "#243F28",
  canopy: "#2E5530",
  canopyMid: "#4C7A3F",
  canopyLt: "#6FA054",
  lime: "#9CC069",
  leafDark: "#1C3B26",
  water: "#3E9C8C",
  waterLt: "#7FC4B2",
  waterDk: "#2E7A70",
  foam: "#F4FAF7",
  rock: "#5C4F3A",
  rockDk: "#3A4A38",
  rockLt: "#6E6248",
  trunk: "#8A6240",
  flower: "#F08A2D",
  flowerDk: "#E86A1F",
  flowerCore: "#F6C14A",
};

/** Hazy angular mountain ridge. */
export function Ridge({
  y,
  drop,
  fill,
}: {
  y: number;
  drop: number;
  fill: string;
}) {
  return (
    <path
      d={`M0 ${y} L 240 ${y - drop * 0.7} L 470 ${y - drop * 0.2} L 760 ${y - drop}
          L 1030 ${y - drop * 0.35} L 1300 ${y - drop * 0.8} L 1600 ${y - drop * 0.3}
          L 1600 1000 L 0 1000 Z`}
      fill={fill}
    />
  );
}

/** Soft mist band. */
export function Mist({ y, opacity = 0.5 }: { y: number; opacity?: number }) {
  return (
    <g fill={JUNGLE.haze} opacity={opacity}>
      <ellipse cx="360" cy={y} rx="360" ry="42" />
      <ellipse cx="960" cy={y + 26} rx="430" ry="52" />
      <ellipse cx="1400" cy={y - 14} rx="300" ry="38" />
    </g>
  );
}

/** Rounded canopy clump (overlapping lobes, single fill). */
export function Clump({
  x,
  y,
  scale = 1,
  fill,
}: {
  x: number;
  y: number;
  scale?: number;
  fill: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={fill}>
      <circle cx="0" cy="0" r="56" />
      <circle cx="58" cy="-22" r="66" />
      <circle cx="124" cy="0" r="58" />
      <circle cx="70" cy="26" r="60" />
      <circle cx="10" cy="28" r="48" />
      <rect x="-24" y="0" width="196" height="66" rx="30" />
    </g>
  );
}

/** Rounded river stone. */
export function Rock({
  x,
  y,
  scale = 1,
  fill = JUNGLE.rock,
}: {
  x: number;
  y: number;
  scale?: number;
  fill?: string;
}) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M-48 26 C -56 -6 -30 -30 4 -28 C 40 -26 58 -4 52 20 C 46 40 -36 44 -48 26 Z"
      fill={fill}
    />
  );
}

/** One cascade step: teal sheet with white foam streaks, pouring top→bottom. */
export function Cascade({
  x,
  y,
  w,
  h,
  spread = 1.15,
}: {
  x: number; // top-center
  y: number;
  w: number; // top width
  h: number;
  spread?: number; // bottom width multiplier
}) {
  const hw = w / 2;
  const bw = hw * spread;
  const streaks = [-0.62, -0.22, 0.18, 0.58];
  return (
    <g>
      <path
        d={`M${x - hw} ${y} C ${x - hw - 6} ${y + h * 0.5} ${x - bw} ${y + h * 0.7} ${x - bw} ${y + h}
            L ${x + bw} ${y + h} C ${x + bw} ${y + h * 0.7} ${x + hw + 6} ${y + h * 0.5} ${x + hw} ${y}) Z`}
        fill={JUNGLE.waterLt}
      />
      <g
        stroke={JUNGLE.foam}
        strokeWidth={w * 0.09}
        strokeLinecap="round"
        fill="none"
      >
        {streaks.map((t, i) => (
          <path
            key={i}
            d={`M${x + hw * t} ${y + 4} C ${x + hw * t} ${y + h * 0.4} ${x + bw * t} ${y + h * 0.6} ${x + bw * t} ${y + h - 4}`}
          />
        ))}
      </g>
      {/* churn at the base */}
      <g fill={JUNGLE.foam}>
        <ellipse cx={x - bw * 0.5} cy={y + h - 2} rx={w * 0.22} ry={h * 0.06} />
        <ellipse cx={x + bw * 0.4} cy={y + h} rx={w * 0.26} ry={h * 0.07} />
        <ellipse cx={x} cy={y + h + 2} rx={w * 0.3} ry={h * 0.07} />
      </g>
    </g>
  );
}

/** Calm teal pool band between cascade steps. */
export function Pool({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={w / 2} ry={h / 2} fill={JUNGLE.water} />
      <path
        d={`M${x - w * 0.3} ${y} q ${w * 0.12} -8 ${w * 0.24} 0 t ${w * 0.24} 0`}
        stroke={JUNGLE.waterLt}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

/** Big pointed tropical leaf with a notched edge, tip toward `rot`. */
export function BigLeaf({
  x,
  y,
  scale = 1,
  rot = 0,
  fill,
  vein,
}: {
  x: number;
  y: number;
  scale?: number;
  rot?: number;
  fill: string;
  vein: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <path
        d="M0 0 C 60 -66 190 -88 300 -44 C 250 -14 210 6 168 34 C 104 66 40 44 0 22 Z"
        fill={fill}
      />
      <path
        d="M4 10 C 100 -12 200 -34 292 -46"
        stroke={vein}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M96 -34 l 34 -8 l -14 30 Z" fill={vein} opacity="0.5" />
      <path d="M188 -42 l 36 -4 l -18 30 Z" fill={vein} opacity="0.5" />
    </g>
  );
}

/** Radiating fan of pointed fern blades (the reference's spiky fans). */
export function FanLeaf({
  x,
  y,
  scale = 1,
  fill,
  a0 = -150,
  a1 = -30,
  blades = 7,
}: {
  x: number;
  y: number;
  scale?: number;
  fill: string;
  a0?: number;
  a1?: number;
  blades?: number;
}) {
  // round all coords so server/client render byte-identical paths (hydration)
  const r = (n: number) => n.toFixed(2);
  const paths = [];
  for (let i = 0; i < blades; i++) {
    const a = ((a0 + ((a1 - a0) * i) / (blades - 1)) * Math.PI) / 180;
    const L = 120 + (i % 2) * 26;
    const tx = Math.cos(a) * L;
    const ty = Math.sin(a) * L;
    paths.push(
      <path
        key={i}
        d={`M0 0 C ${r(tx * 0.3 - ty * 0.1)} ${r(ty * 0.3 + tx * 0.1)} ${r(
          tx * 0.75 - ty * 0.06,
        )} ${r(ty * 0.75 + tx * 0.06)} ${r(tx)} ${r(ty)} C ${r(
          tx * 0.72 + ty * 0.08,
        )} ${r(ty * 0.72 - tx * 0.08)} ${r(tx * 0.32 + ty * 0.1)} ${r(
          ty * 0.32 - tx * 0.1,
        )} 0 0 Z`}
      />,
    );
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={fill}>
      {paths}
    </g>
  );
}

/** Orange paper bloom with fat rounded petals. */
export function Flower({
  x,
  y,
  scale = 1,
  petals = 8,
  fill = JUNGLE.flower,
  edge = JUNGLE.flowerDk,
  core = JUNGLE.flowerCore,
}: {
  x: number;
  y: number;
  scale?: number;
  petals?: number;
  fill?: string;
  edge?: string;
  core?: string;
}) {
  const ps = [];
  for (let i = 0; i < petals; i++) {
    const a = (360 / petals) * i;
    ps.push(
      <g key={i} transform={`rotate(${a})`}>
        <path d="M0 -10 C 20 -26 46 -30 64 -14 C 70 -4 70 6 62 14 C 44 28 18 24 0 10 Z" />
      </g>,
    );
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g fill={edge} transform="translate(4 6)">
        {ps}
      </g>
      <g fill={fill}>{ps}</g>
      <circle r="16" fill={core} />
      <circle r="7" fill={edge} />
    </g>
  );
}

/** Paper toucan perched facing -x: black body, white chest, big orange bill. */
export function Toucan({
  x,
  y,
  scale = 1,
  flip = false,
}: {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
    >
      {/* tail */}
      <path d="M34 6 C 52 18 58 40 52 62 L 30 40 Z" fill="#141B18" />
      {/* body */}
      <path
        d="M-14 -34 C 16 -44 40 -22 36 8 C 32 34 6 44 -12 34 C -32 22 -36 -18 -14 -34 Z"
        fill="#1E2622"
      />
      {/* white chest */}
      <path
        d="M-20 -26 C -6 -34 6 -26 8 -8 C 10 12 0 28 -14 28 C -28 24 -32 -12 -20 -26 Z"
        fill="#F4F1E6"
      />
      {/* bill — two-tone orange, curved */}
      <path
        d="M-18 -22 C -46 -24 -70 -16 -78 -2 C -60 4 -36 4 -16 -2 Z"
        fill={JUNGLE.flower}
      />
      <path
        d="M-78 -2 C -74 6 -58 10 -40 8 L -16 -2 C -36 4 -60 4 -78 -2 Z"
        fill={JUNGLE.flowerDk}
      />
      {/* eye */}
      <circle cx="-8" cy="-16" r="6" fill="#F4F1E6" />
      <circle cx="-8" cy="-16" r="3" fill="#141B18" />
      {/* feet grip */}
      <path
        d="M-4 40 l 6 10 M8 40 l 4 10"
        stroke="#141B18"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  );
}

/** Small paper butterfly. */
export function Butterfly({
  x,
  y,
  scale = 1,
  rot = 0,
  fill = JUNGLE.flowerDk,
  hind = JUNGLE.flower,
}: {
  x: number;
  y: number;
  scale?: number;
  rot?: number;
  fill?: string;
  hind?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <path
        d="M0 0 C -18 -22 -40 -24 -44 -8 C -46 4 -26 10 -2 4 Z"
        fill={fill}
      />
      <path d="M2 0 C 20 -22 42 -24 46 -8 C 48 4 28 10 4 4 Z" fill={fill} />
      <path d="M-2 4 C -16 10 -26 22 -18 28 C -10 32 -2 20 0 8 Z" fill={hind} />
      <path d="M4 4 C 18 10 28 22 20 28 C 12 32 4 20 2 8 Z" fill={hind} />
      <ellipse cx="1" cy="6" rx="4" ry="12" fill="#2A241C" />
    </g>
  );
}

/** Smooth rounded hill mass — the minimal paper landform. Optional `glow`
 *  strokes a blurred halo along the crest only (not the base chord), so
 *  stacked silhouettes stay distinguishable against each other. */
export function Mound({
  x,
  y,
  rx,
  ry,
  fill,
  glow,
  glowOpacity = 0.35,
}: {
  x: number;
  y: number;
  rx: number;
  ry: number;
  fill: string;
  glow?: string;
  glowOpacity?: number;
}) {
  const arc = `M${x - rx} ${y + ry} C ${x - rx} ${y - ry * 0.9} ${x + rx} ${
    y - ry * 0.9
  } ${x + rx} ${y + ry}`;
  return (
    <>
      {glow && (
        <path
          d={arc}
          fill="none"
          stroke={glow}
          strokeWidth="14"
          strokeLinecap="round"
          opacity={glowOpacity}
          filter="url(#pp-soft)"
        />
      )}
      <path d={`${arc} Z`} fill={fill} />
    </>
  );
}

/** Small standing deer silhouette (gold accent, after the reference). */
export function Deer({
  x,
  y,
  scale = 1,
  flip = false,
  fill = JUNGLE.gold,
}: {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  fill?: string;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
      fill={fill}
    >
      {/* body */}
      <path d="M-34 -34 C -40 -48 -8 -52 6 -46 C 22 -52 34 -44 32 -32 C 34 -20 24 -14 12 -14 L -26 -14 C -38 -16 -40 -26 -34 -34 Z" />
      {/* legs */}
      <path d="M-30 -16 l -2 16 l 6 0 l 2 -16 Z" />
      <path d="M-16 -16 l -1 16 l 6 0 l 1 -16 Z" />
      <path d="M14 -16 l 1 16 l 6 0 l -1 -16 Z" />
      <path d="M26 -16 l 2 16 l 6 0 l -2 -16 Z" />
      {/* neck + head */}
      <path d="M24 -44 C 28 -58 36 -66 44 -68 C 50 -66 52 -60 48 -56 C 44 -50 40 -44 38 -38 Z" />
      {/* antlers */}
      <path d="M44 -68 l 4 -12 l 4 2 l -4 10 Z M46 -72 l 10 -6 l 2 4 l -10 6 Z" />
      {/* tail */}
      <path d="M-36 -36 l -8 -4 l 2 8 Z" />
    </g>
  );
}

/** Paper owl silhouette perched upright, with softly glowing amber eyes. */
export function Owl({
  x,
  y,
  scale = 1,
  fill,
  eye = "#FBB13C",
}: {
  x: number;
  y: number;
  scale?: number;
  fill: string;
  eye?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* body + head with ear tufts */}
      <path
        d="M-26 44 C -36 16 -34 -14 -22 -32 L -30 -52 L -12 -40
           C -4 -46 4 -46 12 -40 L 30 -52 L 22 -32
           C 34 -14 36 16 26 44 C 10 52 -10 52 -26 44 Z"
        fill={fill}
      />
      {/* wing crease */}
      <path
        d="M-20 0 C -14 18 -12 32 -14 42"
        stroke={eye}
        strokeWidth="0"
        fill="none"
      />
      {/* beak */}
      <path d="M-3 -12 L 3 -12 L 0 -5 Z" fill={eye} opacity="0.85" />
    </g>
  );
}

/** Live eyes for <Owl>, drawn outside the baked bitmap so they can blink. */
export function OwlEyes({
  x,
  y,
  scale = 1,
  fill,
  eye = "#FBB13C",
  viewBox = "0 0 1600 1000",
  fit = "xMidYMid slice",
}: {
  x: number;
  y: number;
  scale?: number;
  fill: string;
  eye?: string;
  viewBox?: string;
  fit?: string;
}) {
  return (
    <svg
      className="pp-overlay"
      viewBox={viewBox}
      preserveAspectRatio={fit}
      width="100%"
      height="100%"
    >
      <g
        className="owl-eyes"
        transform={`translate(${x} ${y}) scale(${scale})`}
      >
        <rect
          className="owl-eyes__hit"
          x="-28"
          y="-42"
          width="56"
          height="40"
          fill="transparent"
        />
        {[-9, 9].map((cx) => (
          <g className="owl-eye" key={cx}>
            <circle cx={cx} cy="-18" r="5" fill={eye} />
            <circle cx={cx} cy="-18" r="2" fill={fill} />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Slim jungle tree trunk with a small crown, for the background walls. */
export function JungleTrunk({
  x,
  y,
  h = 220,
  scale = 1,
  fill = JUNGLE.trunk,
}: {
  x: number;
  y: number;
  h?: number;
  scale?: number;
  fill?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d={`M-8 0 C -10 ${-h * 0.5} -4 ${-h * 0.8} 2 ${-h} L 12 ${-h} C 8 ${-h * 0.7} 8 ${-h * 0.4} 10 0 Z`}
        fill={fill}
      />
    </g>
  );
}
