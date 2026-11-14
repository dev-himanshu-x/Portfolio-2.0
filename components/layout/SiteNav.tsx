"use client";

import { useEffect, useState } from "react";
import { scrollToY } from "@/components/providers/SmoothScroll";
import { SITE } from "@/content/site";

/**
 * Fixed HUD chrome: top nav + corner frame brackets. Rendered in
 * mix-blend-mode: difference so it reads over cream sky and black smoke alike
 * without ever boxing out the artwork beneath. Once the hero has scrolled away
 * it turns into a solid bar so page content never runs under the links.
 */
export function SiteNav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) =>
      setSolid(!entry.isIntersecting),
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header className={solid ? "hud-nav hud-nav--solid" : "hud-nav"}>
        <a className="hud-nav__mark" href="#top">
          {SITE.firstName}
          <span>©{SITE.year}</span>
        </a>
        <nav className="hud-nav__links">
          <button
            type="button"
            onClick={() => {
              const track = document.getElementById("top");
              if (!track) return;
              const run = track.offsetHeight - window.innerHeight;
              scrollToY(track.offsetTop + run * 0.95);
            }}
          >
            WORK
          </button>
          <a href="#work">PROJECTS</a>
          <a href="#contact">CONTACT</a>
        </nav>
        <p className="hud-nav__status">{SITE.role.toUpperCase()}</p>
      </header>

      <div className="hud-frame" aria-hidden="true">
        <i /> <i /> <i /> <i />
      </div>
    </>
  );
}
