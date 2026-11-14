"use client";

import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { useParallax } from "@/hooks/useParallax";
import { rasterizeLayer, yieldToMain } from "./rasterize";

export interface ParallaxLayer {
  /** 0 = far / barely moves, 1 = nearest / moves most. */
  depth: number;
  /** The paper-cut SVG (or any node) for this layer. */
  content: ReactNode;
  /** Live (un-baked) node stacked over the layer bitmap, for animated bits. */
  overlay?: ReactNode;
  /** Optional extra class for positioning/sizing the layer. */
  className?: string;
  /** Optional horizontal sensitivity multiplier (default 1). */
  sway?: number;
}

interface PaperParallaxProps {
  layers: ParallaxLayer[];
  className?: string;
  /** Pixels of vertical travel applied to a depth=1 layer across the scene. */
  scrollRange?: number;
  /** Pixels of horizontal travel applied to a depth=1 layer at full cursor. */
  pointerRange?: number;
}

/**
 * Reusable paper-cut parallax engine.
 *
 * Each SVG layer is rasterized to a flat image ONCE on mount (its soft
 * puff-shadows and a baked directional drop-shadow burned in). After that the
 * layers are plain <img>s carrying no filter, so the only per-frame work is a
 * GPU transform of a cached bitmap — no SVG filtering or drop-shadow recompute
 * while moving, which is what keeps the parallax smooth.
 *
 * Before the textures are ready (and during SSR) it renders the live SVG so
 * there's never a blank flash; the swap is seamless.
 */
export function PaperParallax({
  layers,
  className,
  scrollRange = 120,
  pointerRange = 36,
}: PaperParallaxProps) {
  const ref = useParallax<HTMLDivElement>();
  const [textures, setTextures] = useState<string[] | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: ref is stable; re-bake only when layers change
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const svgs = Array.from(
      el.querySelectorAll<SVGSVGElement>(".pp-layer svg"),
    );
    if (svgs.length < layers.length) return;

    let cancelled = false;
    const urls: string[] = [];
    (async () => {
      for (let i = 0; i < layers.length; i++) {
        const url = await rasterizeLayer(svgs[i], layers[i].depth, "28,22,18");
        await yieldToMain();
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        urls.push(url);
      }
      if (!cancelled) setTextures(urls);
    })();

    return () => {
      cancelled = true;
      for (const u of urls) URL.revokeObjectURL(u);
    };
  }, [layers]);

  const baked = textures != null;

  return (
    <div ref={ref} className={`pp-scene ${className ?? ""}`}>
      {layers.map((layer, i) => {
        const sway = layer.sway ?? 1;
        const d = layer.depth;
        const transform = `translate3d(calc(var(--px, 0) * ${
          pointerRange * d * sway
        }px), calc(var(--scroll, 0) * ${scrollRange * d}px + var(--py, 0) * ${
          pointerRange * d * 0.5
        }px), 0)`;

        // Once baked, the moving element carries no filter (shadow is in the
        // image). Before that, the live SVG keeps the directional drop-shadow.
        const style: CSSProperties = baked
          ? { transform }
          : {
              transform,
              filter:
                `drop-shadow(${(1.5 + d * 4).toFixed(1)}px ${(2 + d * 5).toFixed(1)}px ${(3 + d * 5).toFixed(1)}px rgba(28,22,18,0.42)) ` +
                `drop-shadow(${(4 + d * 10).toFixed(1)}px ${(6 + d * 14).toFixed(1)}px ${(18 + d * 30).toFixed(1)}px rgba(28,22,18,0.24))`,
            };

        return (
          <div
            key={i}
            className={`pp-layer ${layer.className ?? ""}`}
            style={style}
            aria-hidden="true"
          >
            {baked ? (
              <img src={textures![i]} alt="" draggable={false} />
            ) : (
              layer.content
            )}
          </div>
        );
      })}
    </div>
  );
}
