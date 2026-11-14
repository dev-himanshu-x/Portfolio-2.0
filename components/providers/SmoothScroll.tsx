"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";
import { useEffect } from "react";

let instance: Lenis | null = null;

const ease = (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t));

export function scrollToY(y: number) {
  if (instance) {
    instance.scrollTo(y, { duration: 1.2, easing: ease });
  } else {
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

export function SmoothScroll() {
  useEffect(() => {
    // touch devices keep native momentum scrolling: it is smoother than a JS
    // scroll loop and lets the Lenis chunk stay out of the download entirely
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    let cancelled = false;
    let teardown: (() => void) | undefined;

    import("lenis").then(({ default: LenisCtor }) => {
      if (cancelled) return;

      const lenis = new LenisCtor({
        duration: 1.2,
        easing: ease,
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.0,
        anchors: true,
      });
      instance = lenis;

      lenis.on("scroll", ScrollTrigger.update);

      const tick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const onRefresh = () => {
        lenis.resize();
      };
      ScrollTrigger.addEventListener("refresh", onRefresh);

      teardown = () => {
        ScrollTrigger.removeEventListener("refresh", onRefresh);
        gsap.ticker.remove(tick);
        lenis.destroy();
        instance = null;
      };
    });

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, []);

  return null;
}
