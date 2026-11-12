import { SKILLS } from "@/content/skills";

/** Ink divider strip with an endless display-type marquee. */
export function Marquee() {
  const run = [...SKILLS, ...SKILLS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__inner">
        {[0, 1].map((half) => (
          <span key={half} className="marquee__half">
            {run.map((t, i) => (
              <span key={i} className="marquee__item">
                {t} <em>·</em>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
