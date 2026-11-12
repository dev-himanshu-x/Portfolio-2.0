# Himanshu Jaiswal — Portfolio

A paper-cut, parallax portfolio. The page opens on an erupting volcano, scrolls
into a starlit night that carries my work history, then moves on to projects
and a meadow footer. Every scene is hand-built SVG.

## Tech stack

- **Next.js 16** (App Router) with **React 19** and **TypeScript**
- **GSAP + ScrollTrigger** for the pinned scroll animation
- **Lenis** for smooth, inertial scrolling
- **Plain CSS** (`app/globals.css`), no UI framework
- **Biome** for linting and formatting, **Bun** for packages and scripts

## Getting started

```bash
bun install
bun run dev
```

Open <http://localhost:3000>.

| Script                  | What it does                                           |
| ----------------------- | ------------------------------------------------------ |
| `bun run dev`           | Start the dev server                                   |
| `bun run build`         | Production build                                       |
| `bun run start`         | Serve the production build                             |
| `bun run check`         | Lint, format and organise imports, applying safe fixes |
| `bun run lint`          | Lint only                                              |
| `bun run sync:projects` | Refresh the project list from GitHub                   |

## Project structure

```
app/                     Layout, page and global CSS
components/
  layout/                SiteNav, SiteFooter, FooterGrass
  sections/              IslandJourney (hero and work slide), ProjectsSection, Marquee
  parallax/              PaperParallax, BakedScene, NightSky
  providers/             SmoothScroll (Lenis, wired to GSAP)
hooks/                   useParallax
scenes/
  primitives/            Reusable SVG shapes (palms, clouds, leaves, owl)
  *Scene.tsx             Layer stacks for each scene
content/
  site.ts                Name, role, page title, footer links
  skills.ts              Skills strip
  experience.ts          Work history shown on the night slide
  projects.ts            Hand-written projects plus the generated list
  generated/repos.json   Written by `bun run sync:projects`
scripts/                 sync-projects.ts
public/images/           Footer illustration and project previews
docs/                    Design spec and reference images
```

## Editing content

Text lives in `content/`, artwork in `scenes/`.

- **Name, role, links:** `content/site.ts`
- **Skills strip:** `content/skills.ts`
- **Work history:** `content/experience.ts`
- **Projects that are not on GitHub:** `content/projects.ts`

## Syncing projects from GitHub

```bash
bun run sync:projects
```

The script reads the repos listed in `FEATURED` inside
`scripts/sync-projects.ts` and writes `content/generated/repos.json`. Each
card's tech line comes from the repo's `package.json`, and its description from
the README. To add a project, add its repo name to `FEATURED`, run the script,
and save a preview image as `public/images/projects/<repo-name>.jpg` (lowercase).

GitHub limits anonymous API calls. If you hit the limit, put a personal access
token in `.env` as `GITHUB_TOKEN`; it is never committed.

## How the scroll works

The hero is one pinned section. A scrubbed GSAP timeline lifts the volcano away
and fades in the night scene and work history, while Lenis smooths the wheel
input so the animation follows the scroll without lag. On refresh the scroll
position is restored once the pinned layout is ready.

## Deploying to Cloudflare Pages

The site is a static export (`output: "export"` in `next.config.mjs`), so
Cloudflare serves plain files with no server needed.

| Setting                | Value           |
| ---------------------- | --------------- |
| Framework preset       | None            |
| Build command          | `bun run build` |
| Build output directory | `out`           |
| Root directory         | leave blank     |

Cloudflare detects Bun and Node from the repo, so no environment variables are
required. To preview the exact output locally, run `bun run build` and serve
the `out/` folder with any static server.

## Assets

The footer lizard is Greptile's mascot artwork. Make sure you have the right to
use it before publishing.

# Portfolio-2.0
