import type { ParallaxLayer } from "@/components/parallax/PaperParallax";
import { Billow, Birds, Cloud, Layer, Palm } from "./primitives/shapes";

const SMOKE = "#33312F";
const SMOKE_DK = "#211F1E";
const SMOKE_LT = "#4A4744";
const LAVA = "#F26419";
const LAVA_LT = "#FBB13C";
const EMBER = "#C1300A";
const MOUNTAIN = "#1C1A19";
const ROCK = "#2E2A27";
const PALM = "#14241B";
const GRASS = "#3E7D45";
const GRASS_LT = "#5AA45F";
const PALM_GREEN = "#357F3D";
const PALM_GREEN_DK = "#27632F";
const OCEAN = "#2C3E50";
const OCEAN_LT = "#3D5468";

// Scattered rocky speckle on the mountain face (reference-style stippling).
const ROCK_MARKS: Array<[number, number, number]> = [
  [610, 640, 8],
  [666, 712, 7],
  [724, 792, 9],
  [690, 690, 6],
  [905, 642, 8],
  [946, 726, 7],
  [984, 806, 9],
  [922, 700, 6],
  [566, 812, 8],
  [1014, 838, 8],
  [760, 840, 6],
  [840, 858, 7],
  [640, 580, 6],
  [880, 580, 6],
  [720, 620, 5],
  [800, 600, 5],
];

// Bits of ash flung out around the plume — heavier, trailing to the right.
const ASH: Array<[number, number, number]> = [
  [560, 470, 7],
  [600, 540, 5],
  [880, 430, 6],
  [940, 520, 7],
  [1000, 470, 5],
  [620, 600, 5],
  [900, 590, 6],
  [520, 540, 5],
  [960, 380, 5],
  [560, 360, 4],
  [500, 430, 6],
  [640, 360, 4],
  [1040, 540, 6],
  [1080, 470, 4],
  [1010, 610, 5],
  [700, 560, 4],
  [860, 650, 5],
  [620, 680, 4],
  [960, 680, 5],
  [1120, 560, 7],
  [1180, 440, 5],
  [1150, 620, 4],
  [540, 620, 5],
  [480, 500, 4],
  [1090, 380, 4],
  [820, 600, 3],
  [760, 640, 4],
  [1140, 500, 5],
];

type Pt = [number, number];

/** Smooth closed curve through points via midpoint quadratics. */
function smoothClosed(pts: Pt[]): string {
  const n = pts.length;
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = `M ${mid(pts[n - 1], pts[0]).join(" ")} `;
  for (let i = 0; i < n; i++) {
    const cur = pts[i];
    const m = mid(cur, pts[(i + 1) % n]);
    d += `Q ${cur[0]} ${cur[1]} ${m[0]} ${m[1]} `;
  }
  return d + "Z";
}

/**
 * A meandering lava ribbon. Centerline points are [x, y, halfWidth] from the
 * crater (thick) down to the tip (thin); the wandering x values make it wave,
 * the shrinking half-width makes it taper.
 */
function lavaRibbon(center: Array<[number, number, number]>): string {
  const right: Pt[] = center.map(([x, y, w]) => [x + w, y]);
  const left: Pt[] = center.map(([x, y, w]) => [x - w, y]);
  return smoothClosed([...right, ...left.reverse()]);
}

// Each stream has its OWN origin spread across the crater rim (~748..852),
// then fans out down the slopes — not all from one point.
const LAVA_FL: Array<[number, number, number]> = [
  [744, 472, 8],
  [702, 560, 7],
  [652, 650, 6],
  [602, 742, 4.5],
  [544, 818, 3],
  [500, 878, 1.8],
];
const LAVA_L: Array<[number, number, number]> = [
  [770, 466, 9.5],
  [742, 558, 8],
  [714, 648, 6.5],
  [690, 738, 5],
  [664, 816, 3],
  [644, 878, 2],
];
const LAVA_C: Array<[number, number, number]> = [
  [800, 460, 10.5],
  [795, 556, 9],
  [803, 650, 7],
  [790, 742, 5.5],
  [800, 818, 4],
  [792, 878, 2.4],
];
const LAVA_R: Array<[number, number, number]> = [
  [830, 466, 9.5],
  [858, 558, 8],
  [886, 648, 6.5],
  [910, 738, 5],
  [936, 816, 3],
  [956, 878, 2],
];
const LAVA_FR: Array<[number, number, number]> = [
  [856, 472, 8],
  [898, 560, 7],
  [948, 650, 6],
  [998, 742, 4.5],
  [1056, 818, 3],
  [1100, 878, 1.8],
];
const LAVA_HL_L: Array<[number, number, number]> = [
  [772, 476, 3.4],
  [744, 560, 2.6],
  [716, 648, 1.8],
  [692, 736, 1.1],
];
const LAVA_HL_R: Array<[number, number, number]> = [
  [828, 476, 3.4],
  [856, 560, 2.6],
  [884, 648, 1.8],
  [908, 736, 1.1],
];

/** A row of grass spikes along the island crest (one path for cheapness). */
function GrassSpikes({ y, color }: { y: number; color: string }) {
  let d = "";
  for (let x = 380; x <= 1230; x += 20) {
    const h = 12 + ((x / 20) % 4) * 6;
    d += `M${x} ${y} L ${x + 6} ${y - h} L ${x + 12} ${y} Z `;
  }
  return <path d={d} fill={color} />;
}

/**
 * Erupting volcano island, recreated as stacked cut-paper layers.
 * Back (sky glow) to front (foreground surf), depth rising toward the viewer.
 */
export const volcanoScene: ParallaxLayer[] = [
  // 0 — warm sky wash behind everything
  {
    depth: 0,
    content: (
      <Layer>
        <defs>
          <radialGradient id="v-sky" cx="50%" cy="38%" r="75%">
            <stop offset="0%" stopColor="#FBEFE2" />
            <stop offset="55%" stopColor="#F3ECE1" />
            <stop offset="100%" stopColor="#E7E0D4" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="1600" height="1000" fill="url(#v-sky)" />
      </Layer>
    ),
  },

  // 0.12 — far clouds
  {
    depth: 0.12,
    content: (
      <Layer>
        <Cloud x={120} y={140} scale={1.1} />
        <Cloud x={1180} y={120} scale={1.25} />
        <Cloud x={60} y={520} scale={0.85} />
      </Layer>
    ),
  },

  // 0.2 — distant flock
  {
    depth: 0.22,
    sway: 1.4,
    content: (
      <Layer>
        <Birds
          fill="#2A2826"
          points={[
            [1180, 360, 1.1],
            [1260, 420, 0.9],
            [1320, 330, 0.8],
            [1120, 470, 0.7],
            [1380, 470, 1.0],
            [1040, 250, 0.6],
          ]}
        />
      </Layer>
    ),
  },

  // 0.36 — tall smoke plume (the dramatic vertical mass), with flung ash
  {
    depth: 0.36,
    sway: 0.6,
    content: (
      <Layer>
        <Billow x={690} y={70} scale={1.5} fill={SMOKE_DK} />
        <Billow x={560} y={210} scale={1.35} fill={SMOKE} />
        <Billow x={820} y={250} scale={1.2} fill={SMOKE_LT} />
        <Billow x={700} y={360} scale={1.0} fill={SMOKE} />
        <Billow x={760} y={470} scale={0.78} fill={SMOKE_DK} />
        {/* drifting embers */}
        <circle cx="700" cy="300" r="5" fill={LAVA} />
        <circle cx="840" cy="220" r="4" fill={LAVA_LT} />
        <circle cx="620" cy="360" r="4" fill={LAVA} />
        {/* ash debris */}
        <g fill="#1A1817">
          {ASH.map(([x, y, r], i) => (
            <rect
              key={i}
              x={x}
              y={y}
              width={r}
              height={r}
              rx={r * 0.3}
              transform={`rotate(${(x + y) % 45} ${x} ${y})`}
            />
          ))}
        </g>
      </Layer>
    ),
  },

  // 0.56 — mountain body with rocky texture and lava streams
  {
    depth: 0.56,
    content: (
      <Layer>
        {/* body — broad plateau summit + concave slopes flaring to a wide base.
            The flat-top corners (720/880 @ 402) sit under the lava billow so
            they read as a crater rim, not visible mesa vertices. */}
        <path
          d="M748 402 L 852 402 C 884 566 1008 786 1240 882 L 360 882 C 592 786 716 566 748 402 Z"
          fill={MOUNTAIN}
        />
        {/* darker ridge shading on the right flank */}
        <path
          d="M800 402 L 852 402 C 884 566 1008 786 1240 882 L 872 882 C 852 740 826 566 800 402 Z"
          fill="#100F0E"
          opacity="0.55"
        />
        {/* rocky speckle */}
        <g
          fill="none"
          stroke={ROCK}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
        >
          {ROCK_MARKS.map(([x, y, len], i) => (
            <line key={i} x1={x} y1={y} x2={x + len} y2={y + len * 0.4} />
          ))}
        </g>
        {/* lava radiating from the crater: thick at top, tapering, meandering */}
        <path d={lavaRibbon(LAVA_FL)} fill={EMBER} />
        <path d={lavaRibbon(LAVA_FR)} fill={EMBER} />
        <path d={lavaRibbon(LAVA_L)} fill={LAVA} />
        <path d={lavaRibbon(LAVA_R)} fill={LAVA} />
        <path d={lavaRibbon(LAVA_C)} fill={LAVA} />
        <path d={lavaRibbon(LAVA_HL_L)} fill={LAVA_LT} opacity="0.9" />
        <path d={lavaRibbon(LAVA_HL_R)} fill={LAVA_LT} opacity="0.9" />
      </Layer>
    ),
  },

  // 0.6 — glowing lava billow at the vent, IN FRONT of the crater
  {
    depth: 0.6,
    content: (
      <Layer>
        <Billow x={738} y={398} scale={0.74} fill={EMBER} />
        <Billow x={752} y={416} scale={0.56} fill={LAVA} />
        <Billow x={766} y={434} scale={0.36} fill={LAVA_LT} />
        <circle cx="800" cy="440" r="11" fill="#FFD66B" />
      </Layer>
    ),
  },

  // 0.72 — tall dark palms flanking the island (behind)
  {
    depth: 0.72,
    sway: 0.8,
    content: (
      <Layer>
        <Palm x={360} y={880} scale={0.62} fill={PALM} />
        <Palm x={1240} y={880} scale={0.66} fill={PALM} flip />
        <Palm x={1330} y={900} scale={0.5} fill="#0E1A13" flip />
      </Layer>
    ),
  },

  // 0.82 — island shelf, grass and ocean band
  {
    depth: 0.82,
    content: (
      <Layer>
        {/* ocean slab with ripples */}
        <path d="M120 900 L 1480 900 L 1440 1000 L 160 1000 Z" fill={OCEAN} />
        <path d="M120 900 L 1480 900 L 1474 918 L 126 918 Z" fill={OCEAN_LT} />
        <g
          stroke={OCEAN_LT}
          strokeWidth="3"
          opacity="0.6"
          fill="none"
          strokeLinecap="round"
        >
          <path d="M220 946 q 40 -8 80 0 t 80 0 t 80 0" />
          <path d="M620 968 q 40 -8 80 0 t 80 0 t 80 0" />
          <path d="M1040 950 q 40 -8 80 0 t 80 0" />
        </g>
        {/* island grass crest */}
        <path
          d="M360 882 C 620 856 980 856 1240 882 C 1180 904 1120 906 800 906 C 520 906 440 902 360 882 Z"
          fill={GRASS}
        />
        <path d="M400 882 L 1200 882 L 1216 904 L 384 904 Z" fill={MOUNTAIN} />
      </Layer>
    ),
  },

  // 0.86 — green palms planted on the island, grass spikes (in front of mtn)
  {
    depth: 0.86,
    sway: 0.9,
    content: (
      <Layer>
        <GrassSpikes y={898} color={GRASS_LT} />
        {/* a couple set slightly up the slope */}
        <Palm x={648} y={892} scale={0.22} fill={PALM_GREEN_DK} />
        <Palm x={918} y={894} scale={0.22} fill={PALM_GREEN_DK} flip />
        {/* dense row along the island front; larger and lusher in the centre */}
        <Palm x={430} y={916} scale={0.28} fill={PALM_GREEN} />
        <Palm x={508} y={922} scale={0.24} fill={PALM_GREEN_DK} flip />
        <Palm x={588} y={918} scale={0.32} fill={PALM_GREEN} />
        <Palm x={668} y={924} scale={0.3} fill={PALM_GREEN_DK} flip />
        <Palm x={742} y={920} scale={0.38} fill={PALM_GREEN} />
        <Palm x={800} y={928} scale={0.34} fill={PALM_GREEN_DK} flip />
        <Palm x={858} y={920} scale={0.4} fill={PALM_GREEN} />
        <Palm x={932} y={924} scale={0.3} fill={PALM_GREEN_DK} />
        <Palm x={1012} y={918} scale={0.32} fill={PALM_GREEN} flip />
        <Palm x={1092} y={922} scale={0.26} fill={PALM_GREEN_DK} />
        <Palm x={1170} y={918} scale={0.28} fill={PALM_GREEN} flip />
      </Layer>
    ),
  },

  // 1.0 — foreground surf clouds + a near palm
  {
    depth: 1,
    sway: 1.2,
    content: (
      <Layer>
        <Cloud x={120} y={930} scale={1.15} />
        <Cloud x={1120} y={948} scale={1.3} />
        <Palm x={120} y={1010} scale={0.95} fill="#0C1710" />
      </Layer>
    ),
  },
];
