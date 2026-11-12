// Percent positions within the stage; delays de-sync the loops.
const TWINKLES: Array<[number, number, string]> = [
  [8, 18, "0s"],
  [15, 8, "0.7s"],
  [23, 24, "1.3s"],
  [33, 12, "0.4s"],
  [42, 6, "1.9s"],
  [52, 20, "0.9s"],
  [61, 10, "1.6s"],
  [70, 26, "0.2s"],
  [79, 7, "1.1s"],
  [87, 16, "0.6s"],
  [93, 28, "1.5s"],
  [47, 30, "2.1s"],
];

const FLIES: Array<[number, number, string]> = [
  [14, 76, "0s"],
  [27, 83, "1.4s"],
  [44, 79, "2.6s"],
  [62, 85, "0.8s"],
  [77, 78, "2s"],
  [88, 84, "3.2s"],
];

/**
 * Live night layer over the baked scene: twinkling stars, a looping shooting
 * star, and drifting fireflies. Tiny compositor-only CSS animations (opacity /
 * transform on dots), so it adds life without touching the baked bitmaps.
 */
export function NightSky() {
  return (
    <div className="night-sky" aria-hidden="true">
      {TWINKLES.map(([x, y, d], i) => (
        <span
          key={`t${i}`}
          className="night-sky__star"
          style={{ left: `${x}%`, top: `${y}%`, animationDelay: d }}
        />
      ))}
      {FLIES.map(([x, y, d], i) => (
        <span
          key={`f${i}`}
          className="night-sky__fly"
          style={{ left: `${x}%`, top: `${y}%`, animationDelay: d }}
        />
      ))}
      <span className="night-sky__comet" />
    </div>
  );
}
