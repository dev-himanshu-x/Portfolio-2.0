"use client";

import { useEffect, useId, useRef, useState } from "react";
import { markBaked } from "./bakeStatus";
import type { ParallaxLayer } from "./PaperParallax";
import { rasterizeLayer, yieldToMain } from "./rasterize";

interface BakedSceneProps {
  layers: ParallaxLayer[];
  className?: string;
  /** Class added to every layer div so an external animator (GSAP) can target
   *  them; each layer carries data-depth for depth-scaled motion. */
  layerClassName?: string;
}

/**
 * Same rasterize-to-bitmap approach as PaperParallax (shadows baked in, moving
 * elements carry no filter → smooth), but it does NOT drive its own transforms.
 * Those belong to the GSAP ScrollTrigger timeline in IslandJourney — keeping
 * one owner per transform instead of two systems fighting.
 */
export function BakedScene({
  layers,
  className,
  layerClassName,
}: BakedSceneProps) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [textures, setTextures] = useState<string[] | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const svgs = Array.from(
      el.querySelectorAll<SVGSVGElement>(".pp-layer > svg:not(.pp-overlay)"),
    );
    if (svgs.length < layers.length) return;

    let cancelled = false;
    const urls: string[] = [];
    (async () => {
      for (let i = 0; i < layers.length; i++) {
        const url = await rasterizeLayer(svgs[i], layers[i].depth, null);
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        urls.push(url);
        await yieldToMain();
      }
      if (!cancelled) {
        setTextures(urls);
        markBaked(id);
      }
    })();

    return () => {
      cancelled = true;
      for (const u of urls) URL.revokeObjectURL(u);
    };
  }, [layers, id]);

  const baked = textures != null;

  return (
    <div ref={ref} className={`pp-scene ${className ?? ""}`}>
      {layers.map((layer, i) => (
        <div
          key={i}
          className={`pp-layer ${layerClassName ?? ""} ${layer.className ?? ""}`}
          data-depth={layer.depth}
          aria-hidden="true"
        >
          {baked ? (
            <img src={textures![i]} alt="" draggable={false} />
          ) : (
            layer.content
          )}
          {layer.overlay}
        </div>
      ))}
    </div>
  );
}
