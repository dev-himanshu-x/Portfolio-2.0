# Paper-Cut Parallax Component — Design

**Date:** 2026-06-30
**Status:** Approved

## Goal

Build a reusable paper-cutting-style parallax component in Next.js and a small
demo webpage showcasing it. Two scenes — an erupting **Volcano** island and a
**Mt. Fuji-style Mountain** — recreated as layered SVG "cut paper" art, inspired
by the reference images `Volcano.webp` and `mountain.webp` (not pixel-perfect
copies).

## Interaction Model

Parallax is **scroll + pointer driven, combined**:

- **Scroll** moves layers vertically at depth-dependent speeds.
- **Pointer** (cursor) adds subtle horizontal/depth shift; on touch devices,
  `deviceorientation` tilt substitutes.
- Honors `prefers-reduced-motion` (disables/greatly reduces motion).
- No heavy animation library — custom hook + CSS transforms + `requestAnimationFrame`.

## Architecture (3 units)

### 1. `useParallax` hook (`components/useParallax.ts`)

Single responsibility: turn raw input into smooth, normalized motion values.

- Listens to `scroll`, `pointermove`, and (mobile) `deviceorientation`.
- Smooths via lerp inside a `requestAnimationFrame` loop.
- Writes CSS custom properties onto a target element ref:
  - `--scroll` — normalized scroll progress through the scene (approx -1..1 around viewport center).
  - `--px`, `--py` — normalized pointer/tilt offset (-1..1).
- Cleans up listeners and the rAF loop on unmount. Bails to static values when
  `prefers-reduced-motion: reduce`.

### 2. `<PaperParallax>` component (`components/PaperParallax.tsx`)

Reusable engine — knows nothing about specific scenes.

- Props: `layers: ParallaxLayer[]`, optional `className`.
- `ParallaxLayer = { depth: number; content: ReactNode; className?: string }`
  - `depth` 0 = far/static, 1 = nearest/most movement.
- Attaches the `useParallax` hook to its root container.
- Renders each layer absolutely stacked; each layer's transform is derived from
  the shared CSS vars scaled by its `depth` (via inline `style` using `calc()`
  on the custom properties).
- Cut-paper look comes from per-layer `filter: drop-shadow(...)`.

### 3. Scene definitions (`scenes/volcanoScene.tsx`, `scenes/mountainScene.tsx`)

Each exports a `ParallaxLayer[]` containing the inline SVG artwork.

- **Volcano:** sky/gradient, distant clouds, sun glow, mountain body, lava
  streams, rising smoke plume, palms (mid + foreground), birds, ocean/foreground.
- **Mountain:** sky, swirling orange sun, layered orange clouds, snow-capped
  peak, receding blue ridges, foreground rolling waves.
- Depth values assigned so background elements barely move and foreground
  elements move most.

## Demo Page (`app/page.tsx`)

Single scrolling page, two full-viewport sections:

1. Volcano scene with overlaid paper-cut-style title/tagline.
2. Mountain scene with overlaid title/tagline.

Scrolling between sections drives vertical parallax; cursor/tilt adds depth.

## File Layout

```
app/layout.tsx
app/page.tsx
app/globals.css
components/PaperParallax.tsx
components/useParallax.ts
scenes/volcanoScene.tsx
scenes/mountainScene.tsx
```

## Out of Scope (YAGNI)

- No CMS / dynamic layer loading.
- No slicing of the original .webp files.
- No 3D / WebGL.
- Reference .webp files are kept for inspiration only; not shipped as layers.

## Success Criteria

- `npm run dev` renders both scenes; scrolling and cursor movement produce
  visibly layered depth.
- Motion is smooth (rAF-driven, no jank) and disabled under reduced-motion.
- `<PaperParallax>` is reused unchanged for both scenes.
