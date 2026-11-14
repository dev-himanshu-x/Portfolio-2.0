"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type CSSProperties, useEffect, useRef } from "react";
import { BakedScene } from "@/components/parallax/BakedScene";
import { NightSky } from "@/components/parallax/NightSky";
import { PaperParallax } from "@/components/parallax/PaperParallax";
import { EXPERIENCE } from "@/content/experience";
import { volcanoScene } from "@/scenes/volcanoScene";
import { waterfallScene } from "@/scenes/waterfallScene";
import { CURTAIN_HEIGHT, CURTAIN_TRAVEL, LavaCurtain } from "./LavaCurtain";

const EMBERS = Array.from({ length: 16 }, (_, i) => ({
  x: ((i * 37 + 11) % 92) + 4,
  size: 3 + (i % 3),
}));

/**
 * The portfolio's opening act: the volcano hero carries the outlined name
 * (blend-mode HUD type — visible, never hiding the art). Held in place by a CSS
 * sticky stage, scrolling dives into the crater, a sheet of lava pours down
 * over the screen, and draining off the bottom it reveals the grove, whose
 * layers fan apart by depth — one scrubbed GSAP ScrollTrigger timeline.
 */
export function IslandJourney() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const volcanoRef = useRef<HTMLDivElement>(null);
  const waterfallRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<SVGSVGElement>(null);
  const embersRef = useRef<HTMLDivElement>(null);
  const craterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // the mobile URL bar collapsing resizes the viewport; without this every
    // swipe re-measures the scroll layout and stutters
    ScrollTrigger.config({ ignoreMobileResize: true });

    const touch = window.matchMedia("(pointer: coarse)").matches;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

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

    let startIntro: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const wfLayers = gsap.utils.toArray<HTMLElement>(
        ".wf-layer",
        waterfallRef.current!,
      );

      // hidden (not just transparent): a painted layer holds a full-screen
      // GPU surface, and the grove's eight on top of the volcano's ten
      // exhaust GPU memory, so tiles of the visible scene get dropped
      gsap.set(waterfallRef.current, {
        autoAlpha: 0,
        scale: 1.12,
        yPercent: 9,
      });

      // played from JS: a CSS animation restarts whenever its element is
      // re-inserted into the DOM, which replayed the name several times
      const nameParts = Array.from(titleRef.current!.children);
      if (reduce || (saved > 0 && root.classList.contains("booting"))) {
        gsap.set(nameParts, { clearProps: "all" });
        root.classList.remove("intro");
      } else {
        gsap.set(nameParts, { autoAlpha: 0, yPercent: 90 });
        root.classList.remove("intro");
        const intro = gsap.to(nameParts, {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.13,
          delay: 0.25,
          paused: true,
        });
        if (root.classList.contains("loading")) {
          startIntro = () => intro.play();
          window.addEventListener("site-ready", startIntro, { once: true });
        } else {
          intro.play();
        }
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: trackRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: touch ? 0.4 : true,
        },
      });

      const volcanoLayers = gsap.utils.toArray<HTMLElement>(
        ".pp-layer",
        volcanoRef.current!,
      );
      const foreground = volcanoLayers.filter(
        (el) => parseFloat(el.dataset.depth || "0") >= 0.7,
      );

      // 1 — the name lifts away and the camera dives into the crater
      tl.to(
        titleRef.current,
        { yPercent: -50, autoAlpha: 0, duration: 0.2, ease: "power2.inOut" },
        0,
      );
      tl.to(
        volcanoRef.current?.querySelector(".hud-tag") ?? null,
        { autoAlpha: 0, duration: 0.1 },
        0,
      );
      tl.to(
        volcanoRef.current,
        { scale: 2.8, duration: 0.5, ease: "power2.in" },
        0,
      );
      // 0.02, not 0: a fully transparent layer drops its cached tiles and has
      // to repaint when scrolling back
      tl.to(
        foreground,
        { opacity: 0.02, duration: 0.3, ease: "power1.in" },
        0.04,
      );
      tl.to(
        craterRef.current,
        { opacity: 1, duration: 0.25, ease: "power1.in" },
        0.25,
      );

      // 2 — lava pours down over the screen; the grove is swapped in while it
      // is fully opaque, then the flow drains off the bottom to reveal it
      tl.to(
        curtainRef.current,
        { yPercent: CURTAIN_TRAVEL, duration: 0.62, ease: "power1.inOut" },
        0.38,
      );
      // raised over the volcano instead of hiding it: a hidden layer drops its
      // cached tiles and scrolling back repaints the whole scene in view
      tl.fromTo(
        waterfallRef.current,
        { zIndex: 1 },
        { zIndex: 3, duration: 0.001 },
        0.62,
      );
      tl.to(waterfallRef.current, { autoAlpha: 1, duration: 0.05 }, 0.62);
      tl.to(
        waterfallRef.current,
        { scale: 1, yPercent: 0, duration: 0.45, ease: "power2.out" },
        0.6,
      );
      tl.fromTo(
        waterfallRef.current?.querySelector(".hud-tag") ?? null,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.14, ease: "power2.out" },
        0.9,
      );

      // WORK builds one role at a time: dot pops, connector draws down to the next
      tl.fromTo(
        waterfallRef.current?.querySelector(".night-work .hud-eyebrow") ?? null,
        { autoAlpha: 0, x: -20 },
        { autoAlpha: 1, x: 0, duration: 0.06, ease: "power2.out" },
        0.86,
      );
      gsap.utils
        .toArray<HTMLElement>(".night-work__role", waterfallRef.current!)
        .forEach((el, i) => {
          tl.fromTo(
            el,
            { autoAlpha: 0, x: -28, "--dot": 0, "--line": 0 },
            {
              autoAlpha: 1,
              x: 0,
              "--dot": 1,
              "--line": 1,
              duration: 0.08,
              ease: "power2.out",
            },
            0.88 + i * 0.06,
          );
        });

      // embers lift off the trailing edge of the draining lava and fade out
      const edgeEase = gsap.parseEase("power1.inOut");
      const edgeAt = (t: number) => {
        const p = edgeEase(Math.min(1, Math.max(0, (t - 0.38) / 0.62)));
        return ((p * CURTAIN_TRAVEL) / 100) * CURTAIN_HEIGHT - CURTAIN_HEIGHT;
      };
      gsap.utils
        .toArray<HTMLElement>(".ember", embersRef.current!)
        .forEach((el, i) => {
          const t = 0.77 + i * 0.0145;
          const rise = 110 + ((i * 53) % 90);
          const drift = ((i * 29) % 60) - 30;
          gsap.set(el, { top: `${edgeAt(t) * 100}%` });
          tl.fromTo(
            el,
            { opacity: 0, y: 0, x: 0, scale: 1 },
            { opacity: 1, y: -rise * 0.4, duration: 0.04, ease: "power1.out" },
            t,
          );
          tl.to(
            el,
            {
              opacity: 0,
              y: -rise,
              x: drift,
              scale: 0.4,
              duration: 0.12,
              ease: "power1.in",
            },
            t + 0.04,
          );
        });

      // per-layer parallax: deeper layers rise further
      wfLayers.forEach((el) => {
        const d = parseFloat(el.dataset.depth || "0");
        tl.fromTo(
          el,
          { yPercent: 9 + d * 15 },
          { yPercent: -d * 26, duration: 0.5 },
          0.6,
        );
      });

      // dwell so the grove can be read before the page scrolls on
      tl.to({}, { duration: 0.1 }, 1.04);

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
      if (startIntro) window.removeEventListener("site-ready", startIntro);
      root.classList.remove("booting");
      ctx.revert();
    };
  }, []);

  return (
    <div className="journey-track" id="top" ref={trackRef}>
      <section className="journey-stage" ref={stageRef}>
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

        <LavaCurtain ref={curtainRef} />
        <div className="lava-embers" ref={embersRef} aria-hidden="true">
          {EMBERS.map((e) => (
            <span
              className="ember"
              key={e.x}
              style={{ left: `${e.x}%`, "--s": `${e.size}px` } as CSSProperties}
            />
          ))}
        </div>

        {/* on top: the volcano hero */}
        <div className="stage-volcano" ref={volcanoRef}>
          <PaperParallax layers={volcanoScene} />
          <div className="crater-glow" ref={craterRef} aria-hidden="true" />

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
    </div>
  );
}
