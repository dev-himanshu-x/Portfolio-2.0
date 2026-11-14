import type { ParallaxLayer } from "@/components/parallax/PaperParallax";
import { Mound, Owl, OwlEyes } from "./primitives/jungleShapes";
import { Billow, Layer } from "./primitives/shapes";

// Night palette (after the reference): deep indigo sky falling to a purple
// horizon glow, with the land in ever-darker cut-paper silhouettes.
const SKY_TOP = "#171034";
const SKY_MID = "#241A50";
const GLOW_HI = "#45307E";
const GLOW = "#7A55B4";
const MTN_FAR = "#1A1240";
const MTN = "#120C2E";
const JUNGLE_FAR = "#0D081F";
const JUNGLE_DK = "#0A0619";
const INK = "#070412";
const STAR = "#EDEAF7";
const SMOKE_NIGHT = "#1E1546";
const LAVA = "#F26419";
const LAVA_LT = "#FBB13C";
const EMBER = "#C1300A";
const AMBER = "#FBB13C";

// Deterministic star field (integer math → identical on server & client).
const STARS: Array<[number, number, number]> = Array.from(
  { length: 46 },
  (_, i) => [
    ((i * 263 + 97) % 1560) + 20,
    ((i * 173 + 53) % 420) + 30,
    [1.6, 2.2, 1.4, 2.6][i % 4],
  ],
);

// Ridge crestlines kept open (no closing chord) so their rim-glow strokes
// follow only the skyline, never the bottom of the sheet.
const FAR_CREST = `M0 668
  C 40 648 84 596 132 566
  C 168 590 204 636 252 655
  C 316 630 372 540 428 512
  C 470 534 508 600 560 632
  C 622 610 668 566 724 552
  C 776 572 830 622 900 648
  C 986 640 1040 540 1074 438
  L 1148 438
  C 1182 540 1238 632 1310 652
  C 1364 632 1406 580 1452 556
  C 1500 578 1552 620 1600 640`;

const FOOTHILL_CREST = `M0 766
  C 70 744 132 694 202 672
  C 272 694 334 742 424 760
  C 522 740 602 674 692 650
  C 772 672 842 728 942 754
  C 1042 738 1122 692 1212 672
  C 1292 692 1362 734 1442 752
  C 1500 740 1552 720 1600 706`;

// Resting fireflies baked into the jungle (the drifting ones are live).
const FIREFLIES: Array<[number, number, number]> = [
  [210, 800, 3],
  [352, 842, 2.4],
  [530, 812, 3],
  [934, 830, 2.4],
  [1122, 792, 3],
  [1296, 848, 2.4],
];

/**
 * Starfall Canopy — the island after dark. Indigo sky with a purple horizon
 * glow, silhouette ridges, the volcano still glowing far off, and near-black
 * jungle framing the view. No water — the night sky is the spectacle; the
 * live comet/twinkle/firefly layer is added by <NightSky/> on top.
 */
export const waterfallScene: ParallaxLayer[] = [
  // 1 — night sky, horizon glow, star field
  {
    depth: 0.05,
    content: (
      <Layer>
        <defs>
          <linearGradient id="n-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SKY_TOP} />
            <stop offset="52%" stopColor={SKY_MID} />
            <stop offset="78%" stopColor={GLOW_HI} />
            <stop offset="100%" stopColor={GLOW} />
          </linearGradient>
          <radialGradient id="n-glow" cx="50%" cy="100%" r="70%">
            <stop offset="0%" stopColor={GLOW} stopOpacity="0.9" />
            <stop offset="100%" stopColor={GLOW} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1600" height="1000" fill="url(#n-sky)" />
        <ellipse cx="800" cy="760" rx="900" ry="330" fill="url(#n-glow)" />
        <g fill={STAR}>
          {STARS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} opacity={i % 3 ? 0.85 : 0.55} />
          ))}
        </g>
        {/* paper moon with a soft halo */}
        <radialGradient id="n-moon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EDE9F7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#EDE9F7" stopOpacity="0" />
        </radialGradient>
        <circle cx="330" cy="204" r="150" fill="url(#n-moon)" />
        <circle cx="330" cy="204" r="52" fill="#EDE9F2" />
        <circle cx="312" cy="190" r="10" fill="#D9D2EA" />
        <circle cx="348" cy="218" r="7" fill="#D9D2EA" />
        <circle cx="330" cy="232" r="5" fill="#D9D2EA" />
      </Layer>
    ),
  },

  // 2 — far mountain range; the volcano is one of its peaks, aglow in the dark
  {
    depth: 0.14,
    content: (
      <Layer>
        <defs>
          <radialGradient id="n-ember" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={LAVA} stopOpacity="0.45" />
            <stop offset="100%" stopColor={LAVA} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* crater halo + smoke sit behind the range so the glow rims the rock */}
        <ellipse cx="1111" cy="474" rx="210" ry="140" fill="url(#n-ember)" />
        <Billow x={1046} y={370} scale={0.3} fill={SMOKE_NIGHT} />
        {/* one continuous, naturally rolling range — irregular curved peaks,
            with the volcano's concave cone rising to a crater notch mid-path.
            A blurred crest stroke rims the skyline so the range separates
            from the sky glow behind it. */}
        <path
          d={FAR_CREST}
          fill="none"
          stroke={GLOW}
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.5"
          filter="url(#pp-soft)"
        />
        <path d={`${FAR_CREST} L 1600 1000 L 0 1000 Z`} fill={MTN_FAR} />
        {/* lava veining the cone's own face */}
        <g stroke={LAVA} strokeWidth="5" fill="none" strokeLinecap="round">
          <path d="M1090 446 C 1080 496 1062 548 1040 596" />
          <path d="M1134 446 C 1144 498 1160 552 1180 600" />
        </g>
        <path
          d="M1112 446 C 1112 494 1114 546 1118 598"
          stroke={LAVA_LT}
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.9"
        />
        <ellipse cx="1111" cy="438" rx="30" ry="9" fill={EMBER} />
        <ellipse cx="1111" cy="436" rx="16" ry="5" fill={AMBER} />
      </Layer>
    ),
  },

  // 3 — nearer foothill ridge, softer and darker
  {
    depth: 0.24,
    content: (
      <Layer>
        <path
          d={FOOTHILL_CREST}
          fill="none"
          stroke={GLOW}
          strokeWidth="13"
          strokeLinecap="round"
          opacity="0.4"
          filter="url(#pp-soft)"
        />
        <path d={`${FOOTHILL_CREST} L 1600 1000 L 0 1000 Z`} fill={MTN} />
      </Layer>
    ),
  },

  // 4 — far jungle silhouette
  {
    depth: 0.38,
    content: (
      <Layer>
        <Mound
          x={150}
          y={780}
          rx={360}
          ry={170}
          fill={JUNGLE_FAR}
          glow={GLOW}
          glowOpacity={0.32}
        />
        <Mound
          x={720}
          y={800}
          rx={400}
          ry={150}
          fill={JUNGLE_FAR}
          glow={GLOW}
          glowOpacity={0.32}
        />
        <Mound
          x={1340}
          y={770}
          rx={420}
          ry={180}
          fill={JUNGLE_FAR}
          glow={GLOW}
          glowOpacity={0.32}
        />
      </Layer>
    ),
  },

  // 5 — left jungle bank
  {
    depth: 0.52,
    content: (
      <Layer>
        <Mound
          x={60}
          y={860}
          rx={330}
          ry={230}
          fill={JUNGLE_DK}
          glow={GLOW}
          glowOpacity={0.26}
        />
      </Layer>
    ),
  },

  // 6 — right jungle mass
  {
    depth: 0.66,
    content: (
      <Layer>
        <Mound
          x={1060}
          y={880}
          rx={520}
          ry={250}
          fill={JUNGLE_DK}
          glow={GLOW}
          glowOpacity={0.26}
        />
        <Mound
          x={1520}
          y={820}
          rx={330}
          ry={270}
          fill={JUNGLE_DK}
          glow={GLOW}
          glowOpacity={0.26}
        />
      </Layer>
    ),
  },

  // 7 — near mass with the owl on a branch + resting fireflies
  {
    depth: 0.82,
    sway: 0.9,
    content: (
      <Layer>
        <Mound
          x={1580}
          y={940}
          rx={400}
          ry={300}
          fill={INK}
          glow={GLOW}
          glowOpacity={0.2}
        />
        <path
          d="M1290 700 C 1352 686 1424 688 1486 706"
          stroke={INK}
          strokeWidth="13"
          fill="none"
          strokeLinecap="round"
        />
        <Owl x={1388} y={664} scale={0.85} fill={INK} eye={AMBER} />
        <g fill={AMBER}>
          {FIREFLIES.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} opacity="0.8" />
          ))}
        </g>
      </Layer>
    ),
    overlay: <OwlEyes x={1388} y={664} scale={0.85} fill={INK} eye={AMBER} />,
  },

  // 8 — foreground ink mounds framing the view
  {
    depth: 1,
    sway: 1.2,
    content: (
      <Layer>
        <Mound
          x={190}
          y={1110}
          rx={500}
          ry={230}
          fill={INK}
          glow={GLOW}
          glowOpacity={0.18}
        />
        <Mound
          x={1400}
          y={1130}
          rx={560}
          ry={250}
          fill={INK}
          glow={GLOW}
          glowOpacity={0.18}
        />
      </Layer>
    ),
  },
];
