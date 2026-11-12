import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { IslandJourney } from "@/components/sections/IslandJourney";
import { Marquee } from "@/components/sections/Marquee";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { PROJECTS } from "@/content/projects";

export default function Home() {
  return (
    <main>
      <SiteNav />

      {/* Act I–II: volcano hero → scroll-blended grove (one pinned world) */}
      <IslandJourney />

      <Marquee />

      {/* Act III: selected work over dark jungle ink */}
      <ProjectsSection projects={PROJECTS} />

      {/* Act IV: correspondence */}
      <SiteFooter />
    </main>
  );
}
