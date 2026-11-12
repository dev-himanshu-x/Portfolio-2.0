"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/projects";
import { BigLeaf, FanLeaf } from "@/scenes/primitives/jungleShapes";
import { Palm } from "@/scenes/primitives/shapes";

/**
 * Selected work over dark jungle ink. Cards are thin-lined, transparent HUD
 * frames — the art stays visible through them. Reveal-on-scroll is class
 * toggled (IntersectionObserver) with CSS doing the motion, which is immune
 * to ticker stalls and respects prefers-reduced-motion for free.
 */
const PAGE = 8;

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function Flora({ end }: { end?: boolean }) {
  const leaf = "#25602f";
  return (
    <svg
      className={end ? "work__flora work__flora--end" : "work__flora"}
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <FanLeaf x={-30} y={80} scale={1.6} fill={leaf} a0={-50} a1={70} />
      <BigLeaf
        x={-60}
        y={520}
        scale={1.4}
        rot={-16}
        fill={leaf}
        vein="#14241B"
      />
      <Palm x={90} y={1080} scale={1.05} fill={leaf} />
      <FanLeaf x={1630} y={140} scale={1.7} fill={leaf} a0={110} a1={230} />
      <BigLeaf
        x={1660}
        y={640}
        scale={1.5}
        rot={196}
        fill={leaf}
        vein="#14241B"
      />
      <Palm x={1520} y={1100} scale={1.1} fill={leaf} flip />
    </svg>
  );
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(PAGE);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.7) {
        el.classList.add("in");
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <section className="work" id="work" ref={ref}>
      <Flora />
      <Flora end />

      <div className="work__inner">
        <div className="work-head">
          <p className="hud-eyebrow reveal" style={{ ["--i" as string]: 0 }}>
            PLATE 03 — PROJECTS
          </p>
          <h2 className="work-title reveal" style={{ ["--i" as string]: 1 }}>
            FEATURED <em>WORKS</em>
          </h2>
          <p className="work-sub reveal" style={{ ["--i" as string]: 2 }}>
            Live previews and source code for what I have built.
          </p>
        </div>
        <div className="work-rule" />

        <div className="work-grid">
          {projects.slice(0, shown).map((p, i) => (
            <article
              key={p.title}
              className="work-card reveal"
              style={{ ["--i" as string]: (i % PAGE) + 2 }}
            >
              <div className="work-card__shot">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={`${p.title} preview`}
                    width={1280}
                    height={800}
                    sizes="(min-width: 1040px) 400px, (min-width: 700px) 50vw, 100vw"
                  />
                ) : (
                  <div className="work-card__ph">
                    <span>{p.title}</span>
                    <small>SOURCE ONLY</small>
                  </div>
                )}
              </div>
              <h3 className="work-card__title">{p.title}</h3>
              {p.tech.length > 0 && (
                <p className="work-card__tech">{p.tech.join(" / ")}</p>
              )}
              {p.blurb && <p className="work-card__blurb">{p.blurb}</p>}
              <p className="work-card__links">
                {p.live && (
                  <a href={p.live} target="_blank" rel="noreferrer">
                    <ExternalIcon /> Live Preview
                  </a>
                )}
                {p.source && (
                  <a href={p.source} target="_blank" rel="noreferrer">
                    <GithubIcon /> Source
                  </a>
                )}
              </p>
            </article>
          ))}
        </div>

        {projects.length > PAGE && (
          <div className="work-more">
            <p className="work-more__count">
              {Math.min(shown, projects.length)} / {projects.length}
            </p>
            <button
              type="button"
              className="work-more__btn"
              onClick={() =>
                setShown((n) =>
                  n < projects.length
                    ? Math.min(n + PAGE, projects.length)
                    : PAGE,
                )
              }
            >
              {shown < projects.length ? "SHOW MORE" : "SHOW LESS"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
