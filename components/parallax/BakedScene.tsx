"use client";

import { useEffect, useRef, useState } from "react";
import type { ParallaxLayer } from "./PaperParallax";

const ART_W = 1600;
const ART_H = 1000;

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
  const ref = useRef<HTMLDivElement>(null);
  const [textures, setTextures] = useState<string[] | null>(null);

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
        const url = await rasterizeLayer(svgs[i], layers[i].depth);
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
        </div>
      ))}
    </div>
  );
}

/** Rasterize one SVG to a PNG object URL with the baked two-tier paper shadow. */
async function rasterizeLayer(
  svg: SVGSVGElement,
  depth: number,
): Promise<string> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("width", String(ART_W));
  clone.setAttribute("height", String(ART_H));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const xml = new XMLSerializer().serializeToString(clone);
  const svgUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
  const img = new Image();
  img.decoding = "async";
  img.src = svgUrl;
  await img.decode();

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement("canvas");
  canvas.width = ART_W * dpr;
  canvas.height = ART_H * dpr;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);

  ctx.shadowColor = "rgba(20,32,22,0.24)";
  ctx.shadowBlur = 18 + depth * 30;
  ctx.shadowOffsetX = 4 + depth * 10;
  ctx.shadowOffsetY = 6 + depth * 14;
  ctx.drawImage(img, 0, 0, ART_W, ART_H);

  ctx.shadowColor = "rgba(20,32,22,0.4)";
  ctx.shadowBlur = 3 + depth * 5;
  ctx.shadowOffsetX = 1.5 + depth * 4;
  ctx.shadowOffsetY = 2 + depth * 5;
  ctx.drawImage(img, 0, 0, ART_W, ART_H);

  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob(res, "image/png"),
  );
  return blob ? URL.createObjectURL(blob) : svgUrl;
}
