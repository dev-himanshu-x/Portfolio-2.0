"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { BakedScene } from "@/components/parallax/BakedScene";
import { NightSky } from "@/components/parallax/NightSky";
import { PaperParallax } from "@/components/parallax/PaperParallax";
import { EXPERIENCE } from "@/content/experience";
import { volcanoScene } from "@/scenes/volcanoScene";
import { waterfallScene } from "@/scenes/waterfallScene";

/**
 * The portfolio's opening act: the volcano hero carries the outlined name
 * (blend-mode HUD type — visible, never hiding the art). Pinned on scroll, it
 * drifts up and dissolves while the grove rises from beneath, its layers
 * fanning apart by depth — one scrubbed GSAP ScrollTrigger timeline.
 */
export function IslandJourney() {
  const stageRef = useRef<HTMLDivElement>(null);
  const volcanoRef = useRef<HTMLDivElement>(null);
  const waterfallRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // the mobile URL bar collapsing resizes the viewport; without this every
    // swipe re-measures the pinned layout and stutters
    ScrollTrigger.config({ ignoreMobileResize: true });

    ScrollTrigger.clearScrollMemory("manual");

    const root = document.documentElement;
    let saved = 0;
    try {
      saved = Number(sessionStorage.getItem("scrollY")) || 0;
    } catch {}

    let queued = false;
    const remember = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        try {
          sessionStorage.setItem("scrollY", String(window.scrollY));
        } catch {}
      });
    };
    window.addEventListener("scroll", remember, { passive: true });

    const ctx = gsap.context(() => {
      const wfLayers = gsap.utils.toArray<HTMLElement>(
        ".wf-layer",
        waterfallRef.current!,
      );

      gsap.set(waterfallRef.current, {
        autoAlpha: 0,
        scale: 1.12,
        yPercent: 9,
      });

      // (the name's rise-in intro is pure CSS — see .hero-id > * in globals)

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: "+=280%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(
        titleRef.current,
        { yPercent: -50, autoAlpha: 0, duration: 0.3, ease: "power2.inOut" },
        0,
      );
      tl.to(
        volcanoRef.current,
        { yPercent: -60, scale: 1.04, duration: 0.7, ease: "power1.inOut" },
        0,
      );

      // dusk veil bridges cream day and indigo night through the crossfade
      tl.fromTo(
        veilRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 0.7, duration: 0.2, ease: "power1.in" },
        0.22,
      );
      tl.to(
        veilRef.current,
        { autoAlpha: 0, duration: 0.25, ease: "power1.out" },
        0.5,
      );

      tl.to(
        volcanoRef.current,
        { autoAlpha: 0, duration: 0.4, ease: "power2.inOut" },
        0.25,
      );

      // the grove blends in from beneath
      tl.to(
        waterfallRef.current,
        { autoAlpha: 1, duration: 0.4, ease: "power2.inOut" },
        0.25,
      );
      tl.to(
        waterfallRef.current,
        { scale: 1, yPercent: 0, duration: 0.7, ease: "power2.out" },
        0.2,
      );
      tl.fromTo(
        waterfallRef.current?.querySelectorAll(".hud-tag, .night-work") ?? null,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" },
        0.65,
      );

      // per-layer parallax: deeper layers rise further
      wfLayers.forEach((el) => {
        const d = parseFloat(el.dataset.depth || "0");
        tl.fromTo(
          el,
          { yPercent: 9 + d * 15 },
          { yPercent: -d * 26, duration: 0.82 },
          0.2,
        );
      });

      const st = tl.scrollTrigger;
      if (st && saved > 0 && root.classList.contains("booting")) {
        ScrollTrigger.refresh();
        window.scrollTo(0, saved);
        ScrollTrigger.update();
        tl.progress(st.progress);
      }
    }, stageRef);

    const reveal = requestAnimationFrame(() =>
      root.classList.remove("booting"),
    );

    return () => {
      cancelAnimationFrame(reveal);
      window.removeEventListener("scroll", remember);
      root.classList.remove("booting");
      ctx.revert();
    };
  }, []);

  return (
    <section className="journey-stage" id="top" ref={stageRef}>
      {/* beneath: the grove */}
      <div className="stage-waterfall" ref={waterfallRef}>
        <BakedScene layers={waterfallScene} layerClassName="wf-layer" />
        <NightSky />
        <div className="night-ground" aria-hidden="true" />
        <div className="night-work">
          <p className="hud-eyebrow">WORK</p>
          {EXPERIENCE.map((r) => (
            <div className="night-work__role" key={r.company}>
              <div>
                <p className="night-work__company">{r.company}</p>
                <p className="night-work__title">{r.role}</p>
              </div>
              <p className="night-work__period">{r.period}</p>
            </div>
          ))}
        </div>
        <figure className="hud-tag">
          <i /> <i /> <i /> <i />
          <p className="hud-eyebrow">PLATE 02 — WORK</p>
          <h2 className="hud-tag__title">Starfall Canopy</h2>
          <p className="hud-tag__meta">STARS · COMET · FIREFLIES</p>
        </figure>
      </div>

      <div className="dusk-veil" ref={veilRef} aria-hidden="true" />

      {/* on top: the volcano hero */}
      <div className="stage-volcano" ref={volcanoRef}>
        <PaperParallax layers={volcanoScene} />

        <div className="hero-id" ref={titleRef}>
          <p className="hero-id__eyebrow">PORTFOLIO — FULL STACK DEVELOPER</p>
          <h1 className="hero-id__name">
            HIMANSHU
            <br />
            JAISWAL
          </h1>
        </div>

        <figure className="hud-tag">
          <i /> <i /> <i /> <i />
          <p className="hud-eyebrow">PLATE 01 — ERUPTION</p>
          <h2 className="hud-tag__title">Ashfall Isle</h2>
          <p className="hud-tag__meta">STACKED SVG · CURSOR / TILT DEPTH</p>
        </figure>
      </div>
    </section>
  );
}
