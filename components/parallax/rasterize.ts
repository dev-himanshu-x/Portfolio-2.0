const ART_W = 1600;
const ART_H = 1000;

/** Texture density: phones and weak laptops get 1x; the rest are capped at 1.5x
 *  because ~18 full-screen 2x bitmaps exceed GPU memory and get evicted. */
function textureScale() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const weak =
    window.matchMedia("(pointer: coarse)").matches ||
    (nav.deviceMemory ?? 8) <= 4 ||
    (navigator.hardwareConcurrency ?? 8) <= 4;
  return weak ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
}

let lastScroll = 0;
if (typeof window !== "undefined") {
  window.addEventListener(
    "scroll",
    () => {
      lastScroll = performance.now();
    },
    { passive: true },
  );
}

/** Baking is main-thread work: wait out active scrolling so the scrubbed
 *  timeline never competes with it. */
export async function yieldToMain() {
  await new Promise<void>((r) => setTimeout(r, 0));
  while (performance.now() - lastScroll < 250) {
    await new Promise<void>((r) => setTimeout(r, 120));
  }
}

/**
 * Rasterize one authored SVG to a PNG object URL so the moving layer is a plain
 * bitmap with no filter. `shadowRgb` ("r,g,b") bakes in a two-tier directional
 * drop-shadow; null keeps the pixels identical to the live SVG, which scenes
 * with soft glows need so the swap from SVG to bitmap never shifts colour.
 */
export async function rasterizeLayer(
  svg: SVGSVGElement,
  depth: number,
  shadowRgb: string | null,
): Promise<string> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("width", String(ART_W));
  clone.setAttribute("height", String(ART_H));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const xml = new XMLSerializer().serializeToString(clone);
  const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
  const img = new Image();
  img.decoding = "async";
  img.src = svgUrl;
  await img.decode();

  const scale = textureScale();
  const canvas = document.createElement("canvas");
  canvas.width = ART_W * scale;
  canvas.height = ART_H * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return svgUrl;
  ctx.scale(scale, scale);

  if (shadowRgb) {
    // canvas shadow metrics ignore the transform; 2x is the reference look
    const k = scale / 2;

    ctx.shadowColor = `rgba(${shadowRgb},0.24)`;
    ctx.shadowBlur = (18 + depth * 30) * k;
    ctx.shadowOffsetX = (4 + depth * 10) * k;
    ctx.shadowOffsetY = (6 + depth * 14) * k;
    ctx.drawImage(img, 0, 0, ART_W, ART_H);

    ctx.shadowColor = `rgba(${shadowRgb},0.4)`;
    ctx.shadowBlur = (3 + depth * 5) * k;
    ctx.shadowOffsetX = (1.5 + depth * 4) * k;
    ctx.shadowOffsetY = (2 + depth * 5) * k;
  }
  ctx.drawImage(img, 0, 0, ART_W, ART_H);

  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob(res, "image/png"),
  );
  if (!blob) return svgUrl;
  const url = URL.createObjectURL(blob);
  // decode off the main thread now, not on the first frame the layer shows
  const warm = new Image();
  warm.src = url;
  await warm.decode().catch(() => {});
  return url;
}
