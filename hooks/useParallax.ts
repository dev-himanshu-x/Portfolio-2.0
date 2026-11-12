"use client";

import { useEffect, useRef } from "react";

/**
 * Turns raw scroll + pointer (and mobile tilt) input into smooth, normalized
 * motion values, written as CSS custom properties on a target element:
 *
 *   --scroll : the element's vertical offset from viewport center,
 *              normalized to roughly -1..1 (negative = element is below center).
 *   --px,--py: pointer / tilt offset from screen center, -1..1.
 *
 * The values are eased every animation frame (lerp). The loop parks itself once
 * motion settles and wakes on the next input, so an idle page costs nothing.
 * Honors prefers-reduced-motion by holding everything at rest.
 */
export function useParallax<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      el.style.setProperty("--scroll", "0");
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
      return;
    }

    // Targets (raw input) and current (eased) values.
    let targetScroll = 0;
    let targetPx = 0;
    let targetPy = 0;
    let scroll = 0;
    let px = 0;
    let py = 0;

    let raf = 0;
    let running = false;

    // Only run the animation loop while there's motion left to resolve.
    const wake = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const readScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Center of the element relative to center of the viewport, normalized
      // by viewport height. 0 when perfectly centered.
      const center = rect.top + rect.height / 2 - vh / 2;
      targetScroll = Math.max(-1.5, Math.min(1.5, (-center / vh) * 2));
      wake();
    };

    const onPointer = (e: PointerEvent) => {
      targetPx = (e.clientX / window.innerWidth) * 2 - 1;
      targetPy = (e.clientY / window.innerHeight) * 2 - 1;
      wake();
    };

    const onTilt = (e: DeviceOrientationEvent) => {
      // gamma: left/right [-90,90], beta: front/back [-180,180]
      if (e.gamma != null) targetPx = Math.max(-1, Math.min(1, e.gamma / 35));
      if (e.beta != null)
        targetPy = Math.max(-1, Math.min(1, (e.beta - 45) / 35));
      wake();
    };

    const tick = () => {
      // Exponential smoothing toward the target.
      scroll += (targetScroll - scroll) * 0.08;
      px += (targetPx - px) * 0.08;
      py += (targetPy - py) * 0.08;
      el.style.setProperty("--scroll", scroll.toFixed(4));
      el.style.setProperty("--px", px.toFixed(4));
      el.style.setProperty("--py", py.toFixed(4));

      // Settled? park the loop until the next input.
      const settled =
        Math.abs(targetScroll - scroll) < 4e-4 &&
        Math.abs(targetPx - px) < 4e-4 &&
        Math.abs(targetPy - py) < 4e-4;
      if (settled) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    readScroll();
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);
    window.addEventListener("pointermove", onPointer);
    window.addEventListener("deviceorientation", onTilt);
    wake();

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, []);

  return ref;
}
