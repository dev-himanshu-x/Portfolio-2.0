"use client";

import { useEffect, useRef } from "react";
import { bakedCount, onBake } from "@/components/parallax/bakeStatus";
import { Cloud, Layer } from "@/scenes/primitives/shapes";
import { LoaderOwl } from "./LoaderOwl";

const SCENES = 2;
const STEPS = SCENES + 2;
const MIN_MS = 1200;
const GIVE_UP_MS = 10000;
const SCROLL_KEYS = new Set([
  " ",
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
]);

/**
 * Covers the page until fonts, the window load and both scenes' baked bitmaps
 * are ready, so the swap from live SVG to bitmap never shows. Server-rendered
 * visible; a CSS timer in globals lifts it if this never runs.
 */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    const started = performance.now();

    let loaded = document.readyState === "complete";
    let fontsReady = false;
    let finished = false;
    let hideTimer = 0;
    let raf = 0;
    let target = 0;
    let shown = 0;
    let ready = false;

    const block = (e: Event) => e.preventDefault();
    const blockKey = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) e.preventDefault();
    };
    const unblock = () => {
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", blockKey);
    };
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("keydown", blockKey);

    const finish = () => {
      if (finished) return;
      finished = true;
      unblock();
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          root.classList.remove("loading");
          el.classList.add("loader--done");
          window.dispatchEvent(new Event("site-ready"));
          hideTimer = window.setTimeout(() => {
            el.style.display = "none";
          }, 800);
        }),
      );
    };

    // the bar eases toward the real progress so it never jumps in quarters,
    // and only completes once everything is ready and the minimum has passed
    const tick = () => {
      const minPassed = performance.now() - started >= MIN_MS;
      const goal = ready && minPassed ? 100 : Math.min(target, 92);
      shown += (goal - shown) * 0.1;
      if (goal === 100 && shown > 99.4) shown = 100;
      el.style.setProperty("--p", String(shown / 100));
      if (pctRef.current) pctRef.current.textContent = `${Math.round(shown)}%`;
      if (shown >= 100) {
        window.setTimeout(finish, 250);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const update = () => {
      if (finished) return;
      const done =
        (loaded ? 1 : 0) +
        (fontsReady ? 1 : 0) +
        Math.min(bakedCount(), SCENES);
      target = (done / STEPS) * 100;
      ready = done >= STEPS;
    };

    const onLoad = () => {
      loaded = true;
      update();
    };
    window.addEventListener("load", onLoad);
    document.fonts.ready.then(() => {
      fontsReady = true;
      update();
    });
    const offBake = onBake(update);
    const giveUp = window.setTimeout(() => {
      ready = true;
    }, GIVE_UP_MS);
    update();

    return () => {
      unblock();
      window.removeEventListener("load", onLoad);
      offBake();
      cancelAnimationFrame(raf);
      clearTimeout(giveUp);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="loader" ref={ref} role="status" aria-label="Loading">
      <div className="loader__sky loader__sky--far" aria-hidden="true">
        <Layer>
          <Cloud x={150} y={220} scale={0.9} />
          <Cloud x={930} y={150} scale={1.1} />
          <Cloud x={1380} y={340} scale={0.8} />
        </Layer>
      </div>
      <div className="loader__sky loader__sky--mid" aria-hidden="true">
        <Layer>
          <Cloud x={460} y={500} scale={1.2} />
          <Cloud x={1180} y={620} scale={1} />
          <Cloud x={-60} y={690} scale={1} />
        </Layer>
      </div>
      <div className="loader__sky loader__sky--near" aria-hidden="true">
        <Layer>
          <Cloud x={720} y={850} scale={1.5} />
          <Cloud x={80} y={900} scale={1.3} />
          <Cloud x={1330} y={930} scale={1.4} />
        </Layer>
      </div>

      <div className="loader__content">
        <LoaderOwl />

        <div className="loader__hud">
          <p className="loader__meta">
            <span>LOADING</span>
            <span ref={pctRef}>0%</span>
          </p>
          <div className="loader__bar">
            <i />
          </div>
        </div>
      </div>
    </div>
  );
}
