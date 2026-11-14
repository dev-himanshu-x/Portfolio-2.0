import data from "./generated/repos.json";

export interface Project {
  title: string;
  blurb: string;
  tech: string[];
  live?: string;
  source?: string;
  image?: string;
}

const WORK: Project[] = [
  {
    title: "EduVverse",
    blurb:
      "A modular campus ERP for universities, with admissions, fees, academics, exams, HR, payroll, hostel and transport on one record for every student and employee.",
    tech: [
      "React",
      "TypeScript",
      "TanStack Router",
      "TanStack Query",
      "Ant Design",
    ],
    live: "https://eduvverse.com/",
    image: "/images/projects/eduvverse.webp",
  },
  {
    title: "KIET Website",
    blurb:
      "The official website of KIET Deemed to be University, covering programmes, admissions, fees, placements and campus life.",
    tech: ["React", "Next.js", "JavaScript", "Bootstrap"],
    live: "https://www.kiet.edu/",
    image: "/images/projects/kiet.webp",
  },
];

export const PROJECTS: Project[] = [...WORK, ...data];
