import { Owl, OwlEyes } from "@/scenes/primitives/jungleShapes";

const INK = "#070412";
const FACE = "#1d1745";
const AMBER = "#FBB13C";
const VIEW = "-98 -72 196 148";

const BELLY = [4, 15, 26, 37];

/** The scene's owl, perched on a branch, with enough detail to hold up large. */
export function LoaderOwl() {
  return (
    <div className="loader__owl">
      <svg viewBox={VIEW} aria-hidden="true">
        <path
          d="M-78 58 C-48 49 42 48 80 60"
          stroke="#4a3626"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M-78 61 C-48 52 42 51 80 63"
          stroke="#2e2118"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M62 56 C70 46 76 38 84 34"
          stroke="#4a3626"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <g fill="#3e7d45">
          <ellipse
            cx="80"
            cy="30"
            rx="11"
            ry="4.6"
            transform="rotate(-38 80 30)"
          />
          <ellipse
            cx="88"
            cy="38"
            rx="9"
            ry="4"
            transform="rotate(14 88 38)"
            fill="#357f3d"
          />
          <ellipse
            cx="-70"
            cy="52"
            rx="10"
            ry="4.2"
            transform="rotate(-150 -70 52)"
            fill="#357f3d"
          />
        </g>

        <Owl x={0} y={0} scale={1} fill={INK} eye={AMBER} />

        <g fill={FACE}>
          <circle cx="-9" cy="-18" r="13" />
          <circle cx="9" cy="-18" r="13" />
        </g>
        <path d="M-3 -12 L 3 -12 L 0 -5 Z" fill={AMBER} />
        <g fill="none" stroke={FACE} strokeWidth="1.8" strokeLinecap="round">
          {BELLY.map((y) => (
            <g key={y}>
              <path d={`M-14 ${y} Q-7 ${y + 6} 0 ${y}`} />
              <path d={`M0 ${y} Q7 ${y + 6} 14 ${y}`} />
            </g>
          ))}
          <path d="M-22 -4 C-29 14 -25 33 -17 44" />
          <path d="M22 -4 C29 14 25 33 17 44" />
        </g>
        <g fill="none" stroke="#d99a2b" strokeWidth="2.4" strokeLinecap="round">
          {[-1, 1].map((side) => (
            <g key={side} transform={`translate(${side * 11} 0)`}>
              <path d="M-4 49 q-1 6 -3 8" />
              <path d="M0 50 q0 6 0 9" />
              <path d="M4 49 q1 6 3 8" />
            </g>
          ))}
        </g>
      </svg>
      <OwlEyes
        x={0}
        y={0}
        scale={1}
        fill={INK}
        eye={AMBER}
        viewBox={VIEW}
        fit="xMidYMid meet"
      />
    </div>
  );
}
