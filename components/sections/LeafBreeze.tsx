"use client";

import { type CSSProperties, useEffect, useRef } from "react";

// top %, size px, drift seconds, delay seconds, colour, vertical sway px
const LEAVES: Array<[number, number, number, number, string, number]> = [
  [4, 22, 19, -3, "#3f9a4a", 40],
  [9, 16, 24, -14, "#2f7a3b", 28],
  [15, 26, 21, -8, "#5fae5a", 52],
  [22, 18, 27, -19, "#25602f", 34],
  [29, 24, 18, -5, "#d98a2b", 46],
  [36, 15, 25, -12, "#3f9a4a", 30],
  [43, 28, 22, -17, "#2f7a3b", 56],
  [50, 17, 26, -2, "#5fae5a", 36],
  [57, 23, 20, -10, "#3f9a4a", 44],
  [64, 19, 28, -21, "#d98a2b", 32],
  [71, 27, 19, -7, "#25602f", 50],
  [78, 16, 24, -15, "#5fae5a", 38],
  [85, 22, 23, -4, "#2f7a3b", 42],
  [92, 18, 26, -11, "#3f9a4a", 30],
];

export function LeafBreeze() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      el?.setAttribute("data-live", "");
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      el.toggleAttribute("data-live", entry.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="breeze" ref={ref} aria-hidden="true">
      {LEAVES.map(([top, size, dur, delay, color, sway], i) => (
        <span
          key={i}
          className="breeze__leaf"
          style={
            {
              "--top": `${top}%`,
              "--size": `${size}px`,
              "--dur": `${dur}s`,
              "--delay": `${delay}s`,
              "--sway": `${sway}px`,
            } as CSSProperties
          }
        >
          <span className="breeze__sway">
            <svg className="breeze__spin" viewBox="0 0 24 24">
              <path
                d="M2 22 C 2 10 10 2 22 2 C 22 14 14 22 2 22 Z"
                fill={color}
              />
              <path
                d="M3.5 20.5 L 17 7"
                stroke="#0d1f13"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.45"
              />
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}
