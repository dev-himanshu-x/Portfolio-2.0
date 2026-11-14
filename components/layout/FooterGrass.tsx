const W = 1600;
const H = 300;

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

function blades(
  seed: number,
  count: number,
  minH: number,
  maxH: number,
  minW: number,
  maxW: number,
) {
  const rand = rng(seed);
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = (i / count) * (W + 80) - 40 + rand() * 30;
    const h = minH + rand() * (maxH - minH);
    const w = minW + rand() * (maxW - minW);
    const lean = (rand() - 0.5) * h * 0.55;
    const tipX = x + lean;
    const tipY = H - h;
    const cx = x + lean * 0.25;
    const cy = H - h * 0.55;
    out.push(
      `M${r1(x - w / 2)} ${H}Q${r1(cx - w / 2)} ${r1(cy)} ${r1(tipX)} ${r1(tipY)}Q${r1(cx + w / 2)} ${r1(cy)} ${r1(x + w / 2)} ${H}Z`,
    );
  }
  return out.join("");
}

const BACK = blades(11, 64, 70, 150, 12, 22);
const MID = blades(23, 78, 50, 125, 14, 26);
const FRONT = blades(37, 90, 28, 84, 16, 30);

const FLOWERS = [
  { x: 150, h: 120, s: 1 },
  { x: 470, h: 150, s: 1.1 },
  { x: 700, h: 80, s: 0.8 },
  { x: 930, h: 135, s: 1.05 },
  { x: 1130, h: 135, s: 0.95 },
  { x: 1540, h: 70, s: 0.75 },
];

function Sunflower({ x, h, s }: { x: number; h: number; s: number }) {
  const cy = H - h;
  const petals = Array.from({ length: 14 }, (_, i) => i * (360 / 14));
  return (
    <g>
      <path
        d={`M${x} ${H}Q${x + 6} ${H - h * 0.5} ${x} ${cy}`}
        fill="none"
        stroke="#2f6b36"
        strokeWidth={4 * s}
      />
      <g transform={`translate(${x} ${cy}) scale(${s})`}>
        {petals.map((a) => (
          <ellipse
            key={a}
            cx="0"
            cy="-17"
            rx="6"
            ry="13"
            fill={a % 50 < 26 ? "#f5b820" : "#e9a512"}
            transform={`rotate(${a})`}
          />
        ))}
        <circle r="12" fill="#6b5a7a" />
        <circle r="7" fill="#4d3f5c" />
      </g>
    </g>
  );
}

/** Paper-cut meadow with sunflowers along the footer's bottom edge. */
export function FooterGrass() {
  return (
    <svg
      className="footer__grass"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <path d={BACK} fill="#8fb58a" />
      <path d={MID} fill="#3f7d44" />
      {FLOWERS.map((f) => (
        <Sunflower key={f.x} {...f} />
      ))}
      <path d={FRONT} fill="#1f5a2b" />
      <rect y={H - 16} width={W} height="16" fill="#1f5a2b" />
    </svg>
  );
}
