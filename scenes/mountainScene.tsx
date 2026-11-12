import type { ParallaxLayer } from "@/components/parallax/PaperParallax";
import { Cloud, Layer } from "./primitives/shapes";

const SWIRL = ["#F26419", "#F6911E", "#FBB034", "#FDC659"];
const SNOW = "#F4EFE6";
const SNOW_SH = "#D9D2C4";
const PEAK = "#2E6E86";
const PEAK_SH = "#1C4E63";
const RIDGE = ["#2389A8", "#1C6E8C", "#134B63", "#0E3A4E"];
const WAVE = ["#4FA6BE", "#2E89A6", "#1C6E8C", "#134B63"];
const SAND = "#EAD9C4";

/** Concentric rings approximating the hypnotic paper sun. */
function Swirl() {
  const rings = [];
  let r = 560;
  let i = 0;
  while (r > 40) {
    rings.push(
      <circle key={r} cx="800" cy="360" r={r} fill={SWIRL[i % SWIRL.length]} />,
    );
    r -= 34;
    i += 1;
  }
  return <g>{rings}</g>;
}

/**
 * Mt. Fuji-style scene as stacked cut paper: a swirling sun, layered orange
 * clouds, a snow-capped peak, receding blue ridges, and rolling foreground waves.
 */
export const mountainScene: ParallaxLayer[] = [
  // 0 — vermilion sky
  {
    depth: 0,
    content: (
      <Layer>
        <defs>
          <linearGradient id="m-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E84A27" />
            <stop offset="100%" stopColor="#D43C1E" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1600" height="1000" fill="url(#m-sky)" />
      </Layer>
    ),
  },

  // 0.08 — the swirling sun
  {
    depth: 0.08,
    content: (
      <Layer>
        <Swirl />
      </Layer>
    ),
  },

  // 0.18 — orange paper clouds in the corners
  {
    depth: 0.2,
    sway: 1.1,
    content: (
      <Layer>
        <Cloud x={70} y={120} scale={1.2} fill="#F26419" edge="#C94E13" />
        <Cloud x={1180} y={90} scale={1.3} fill="#F6911E" edge="#D2691C" />
        <Cloud x={1320} y={300} scale={0.9} fill="#F26419" edge="#C94E13" />
        <Cloud x={20} y={360} scale={0.8} fill="#F6911E" edge="#D2691C" />
      </Layer>
    ),
  },

  // 0.4 — the main snow-capped peak
  {
    depth: 0.4,
    content: (
      <Layer>
        {/* body */}
        <path d="M800 210 L 1180 760 L 420 760 Z" fill={PEAK} />
        {/* shaded right flank */}
        <path
          d="M800 210 L 1180 760 L 800 760 Z"
          fill={PEAK_SH}
          opacity="0.55"
        />
        {/* snow cap with ragged lower edge */}
        <path
          d="M800 210 L 690 370 L 728 360 L 700 430 L 752 410 L 740 470 L 800 440
             L 860 470 L 848 410 L 900 430 L 872 360 L 910 370 Z"
          fill={SNOW}
        />
        <path
          d="M800 210 L 800 440 L 860 470 L 848 410 L 900 430 L 872 360 L 910 370 Z"
          fill={SNOW_SH}
          opacity="0.5"
        />
      </Layer>
    ),
  },

  // 0.55 — smaller flanking peaks
  {
    depth: 0.55,
    content: (
      <Layer>
        <path d="M300 760 L 470 560 L 640 760 Z" fill={RIDGE[1]} />
        <path d="M470 560 L 560 660 L 420 700 Z" fill={SNOW} opacity="0.92" />
        <path d="M1000 760 L 1160 580 L 1320 760 Z" fill={RIDGE[1]} />
        <path
          d="M1160 580 L 1240 668 L 1100 706 Z"
          fill={SNOW}
          opacity="0.92"
        />
      </Layer>
    ),
  },

  // 0.68 — receding blue ridges
  {
    depth: 0.68,
    content: (
      <Layer>
        <path
          d="M0 720 C 360 640 540 700 800 690 C 1080 680 1280 640 1600 712 L 1600 1000 L 0 1000 Z"
          fill={RIDGE[0]}
        />
        <path
          d="M0 800 C 300 740 620 790 900 770 C 1180 752 1380 770 1600 800 L 1600 1000 L 0 1000 Z"
          fill={RIDGE[1]}
        />
        <path
          d="M0 870 C 360 820 700 860 980 848 C 1240 838 1420 858 1600 866 L 1600 1000 L 0 1000 Z"
          fill={RIDGE[2]}
        />
      </Layer>
    ),
  },

  // 0.82 — sand break + first wave band
  {
    depth: 0.82,
    content: (
      <Layer>
        <path
          d="M0 900 C 300 880 560 912 820 904 C 1100 896 1360 916 1600 902 L 1600 1000 L 0 1000 Z"
          fill={SAND}
        />
        <path
          d="M0 938 C 280 916 600 948 860 940 C 1140 930 1380 950 1600 938 L 1600 1000 L 0 1000 Z"
          fill={WAVE[0]}
        />
      </Layer>
    ),
  },

  // 1.0 — foreground rolling waves
  {
    depth: 1,
    sway: 1.2,
    content: (
      <Layer>
        <path
          d="M0 958 C 320 936 640 970 960 960 C 1220 952 1420 968 1600 958 L 1600 1000 L 0 1000 Z"
          fill={WAVE[1]}
        />
        <path
          d="M0 980 C 360 962 720 990 1040 982 C 1280 976 1440 986 1600 980 L 1600 1000 L 0 1000 Z"
          fill={WAVE[2]}
        />
        <path
          d="M0 996 C 400 984 820 1004 1180 998 L 1600 996 L 1600 1000 L 0 1000 Z"
          fill={WAVE[3]}
        />
      </Layer>
    ),
  },
];
