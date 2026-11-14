/// <reference types="bun" />
import { existsSync } from "node:fs";

const USER = "dev-himanshu-x";
const FEATURED = [
  "Attendance-Cybervidya",
  "Templify-Email-Template",
  "Tv-Time",
  "Fern-Ecommerce",
  "Sfridoo-Recycle",
  "PeerPulse-Chatapp",
];
const RAW = `https://raw.githubusercontent.com/${USER}`;

interface Repo {
  name: string;
  homepage: string | null;
  description?: string | null;
  language: string | null;
  fork?: boolean;
  archived?: boolean;
  pushed_at: string;
}

const TECH: Record<string, string> = {
  next: "Next.js",
  react: "React",
  typescript: "TypeScript",
  tailwindcss: "Tailwind CSS",
  "@tanstack/react-router": "TanStack Router",
  "@tanstack/react-start": "TanStack Start",
  "@tanstack/react-query": "TanStack Query",
  "@tanstack/react-table": "TanStack Table",
  "@tanstack/react-virtual": "TanStack Virtual",
  "framer-motion": "Framer Motion",
  motion: "Motion",
  gsap: "GSAP",
  antd: "Ant Design",
  "@mui/material": "Material UI",
  zustand: "Zustand",
  peerjs: "PeerJS",
  three: "Three.js",
  "@react-three/fiber": "React Three Fiber",
  express: "Express",
  mongoose: "MongoDB",
  prisma: "Prisma",
  "@prisma/client": "Prisma",
  electron: "Electron",
  recharts: "Recharts",
  "react-hook-form": "React Hook Form",
  bootstrap: "Bootstrap",
};

async function repoList(): Promise<Repo[]> {
  if (process.env.REPOS_FILE) {
    return JSON.parse(await Bun.file(process.env.REPOS_FILE).text());
  }
  const headers: Record<string, string> = { "User-Agent": "portfolio-sync" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(
    `https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`,
    { headers },
  );
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  return res.json();
}

async function rawText(name: string, file: string) {
  const res = await fetch(`${RAW}/${name}/HEAD/${file}`);
  if (!res.ok) return "";
  const bytes = new Uint8Array(await res.arrayBuffer());
  const utf16 = bytes[0] === 0xff && bytes[1] === 0xfe;
  return new TextDecoder(utf16 ? "utf-16le" : "utf-8").decode(bytes);
}

function blurbFrom(markdown: string) {
  const cleaned = markdown
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>]/g, "");
  const paragraph = cleaned
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .find(
      (p) =>
        p.length > 40 && !p.endsWith(":") && !/^(#|\||-|\d+\.|```|=)/.test(p),
    );
  if (!paragraph) return "";
  const sentences = paragraph.split(/(?<=[.!?])\s+(?=[A-Z])/);
  let out = "";
  for (const sentence of sentences) {
    const next = `${out}${sentence}`.trim();
    if (out && next.length > 180) break;
    out = `${next} `;
  }
  out = out.trim();
  if (out.length > 200) {
    const dash = out.lastIndexOf(" — ", 200);
    out =
      dash > 60
        ? `${out.slice(0, dash)}.`
        : `${out.slice(0, 180).replace(/\s+\S*$/, "")}…`;
  }
  return out;
}

function techFrom(pkgJson: string, language: string | null) {
  try {
    const pkg = JSON.parse(pkgJson);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const found = [
      ...new Set(
        Object.keys(TECH)
          .filter((d) => d in deps)
          .map((d) => TECH[d]),
      ),
    ];
    if (found.length) return found.slice(0, 5);
  } catch {}
  return language ? [language] : [];
}

const all = await repoList();
const repos = FEATURED.map((name) => all.find((r) => r.name === name)).filter(
  (r): r is Repo => r !== undefined,
);

const projects = await Promise.all(
  repos.map(async (r) => {
    const [readme, pkg] = await Promise.all([
      rawText(r.name, "README.md"),
      rawText(r.name, "package.json"),
    ]);
    const slug = r.name.toLowerCase();
    return {
      title: r.name.replace(/[-_]+/g, " "),
      blurb: r.description || blurbFrom(readme),
      tech: techFrom(pkg, r.language),
      live: r.homepage || undefined,
      source: `https://github.com/${USER}/${r.name}`,
      image: existsSync(`public/images/projects/${slug}.webp`)
        ? `/images/projects/${slug}.webp`
        : undefined,
    };
  }),
);

await Bun.write(
  "content/generated/repos.json",
  `${JSON.stringify(projects, null, 2)}\n`,
);
console.log(`wrote ${projects.length} projects`);
