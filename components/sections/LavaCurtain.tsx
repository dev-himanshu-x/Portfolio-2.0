import type { Ref } from "react";

export const CURTAIN_HEIGHT = 2.6;
export const CURTAIN_TRAVEL = 100 * (1 + 1 / CURTAIN_HEIGHT);

const W = 1000;
const H = 1600;
const BASE = 1340;

const CREST: number[] = [70, 30, 95, 45, 110, 35, 85, 55, 100];

// [x, half-width, length] of each drip hanging off the leading edge
const DRIPS: Array<[number, number, number]> = [
  [70, 62, 120],
  [185, 48, 250],
  [305, 70, 90],
  [430, 54, 200],
  [545, 66, 140],
  [660, 46, 255],
  [775, 64, 100],
  [880, 52, 210],
  [960, 40, 150],
];

const VEINS = [
  "M120 260 C 150 520 90 780 130 1040",
  "M360 180 C 330 460 400 700 350 980",
  "M610 300 C 650 560 580 820 630 1120",
  "M850 220 C 820 500 890 760 840 1060",
];

function crestPath(): string {
  const step = W / (CREST.length - 1);
  let d = `M0 ${CREST[0]}`;
  for (let i = 1; i < CREST.length; i++) {
    const x = i * step;
    const px = (i - 1) * step;
    d += ` Q ${px} ${CREST[i - 1]} ${(px + x) / 2} ${(CREST[i - 1] + CREST[i]) / 2}`;
  }
  return `${d} L ${W} ${CREST[CREST.length - 1]} L ${W} ${BASE} L 0 ${BASE} Z`;
}

function dripPath([x, w, len]: [number, number, number]): string {
  const tip = BASE + len;
  return (
    `M ${x - w} ${BASE - 10} C ${x - w} ${BASE + len * 0.55} ${x - w * 0.55} ${tip} ${x} ${tip} ` +
    `C ${x + w * 0.55} ${tip} ${x + w} ${BASE + len * 0.55} ${x + w} ${BASE - 10} Z`
  );
}

/**
 * A sheet of molten lava taller than the stage: cooled crust along its top
 * edge, glowing fingers hanging off its bottom edge. Scroll slides it down
 * over the scene so it reads as a flow pouring across the screen.
 */
export function LavaCurtain({ ref }: { ref: Ref<SVGSVGElement> }) {
  return (
    <svg
      ref={ref}
      className="lava-curtain"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="lc-grad"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="0"
          y2={H}
        >
          <stop offset="0" stopColor="#1F0A05" />
          <stop offset="0.07" stopColor="#7A1F08" />
          <stop offset="0.2" stopColor="#C1300A" />
          <stop offset="0.55" stopColor="#F26419" />
          <stop offset="1" stopColor="#FBB13C" />
        </linearGradient>
      </defs>
      <path d={crestPath()} fill="url(#lc-grad)" />
      {DRIPS.map((drip) => (
        <path key={drip[0]} d={dripPath(drip)} fill="url(#lc-grad)" />
      ))}
      <g fill="none" stroke="#FBB13C" strokeWidth="14" strokeLinecap="round">
        {VEINS.map((d) => (
          <path key={d} d={d} opacity="0.32" />
        ))}
      </g>
    </svg>
  );
}
